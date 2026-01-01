package com.example.main_service.dashboard.service.impl;

import com.example.main_service.contest.model.ContestEntity;
import com.example.main_service.contest.model.ContestParticipantsEntity;
import com.example.main_service.contest.repo.ContestParticipantsRepo;
import com.example.main_service.contest.repo.ContestRepo;
import com.example.main_service.contest.service.ContestService;
import com.example.main_service.dashboard.dtos.DashBoardItemResponseDto;
import com.example.main_service.dashboard.dtos.DashBoardPageResponseDto;
import com.example.main_service.dashboard.dtos.SolvedProblemDto;
import com.example.main_service.dashboard.service.DashBoardService;
import com.example.main_service.problem.ProblemGrpcClient;
import com.example.main_service.sharedAttribute.exceptions.ErrorCode;
import com.example.main_service.sharedAttribute.exceptions.specException.ContestBusinessException;
import com.example.main_service.user.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.stream.IntStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashBoardServiceImpl implements DashBoardService {

    private final StringRedisTemplate redis;
    private final ContestService contestService;
    private final ContestRepo contestRepo;
    private final ProblemGrpcClient problemGrpcClient;
    private final UserServiceImpl userService;
    private final ObjectMapper objectMapper;
    private final ContestParticipantsRepo contestParticipantsRepo;

    private static final long SCORE_WEIGHT = 1_000_000_000L;
    private static final long PENALTY_BLOCK_SECONDS = 30L; // block 30s

    @Override
    public void onSubmissionJudged(
            String submissionId,
            Long userId,
            Long contestId,
            String problemId,
            boolean allAccepted,
            long submitTimeEpochSeconds
    ) {
        if (!allAccepted) return;
        if (!contestService.isContestRunning(contestId)) return;

        String userBaseKey = userBaseKey(contestId, userId);
        String acSetKey = acProblemsKey(userBaseKey);

        // đã AC rồi -> skip
        if (Boolean.TRUE.equals(redis.opsForSet().isMember(acSetKey, problemId))) return;

        // mark AC
        redis.opsForSet().add(acSetKey, problemId);

        int baseScore = problemGrpcClient.getProblemById(problemId).getScore();
        long contestStart = contestService.getContestStartTime(contestId);

        long elapsed = Math.max(0, submitTimeEpochSeconds - contestStart);
        long blocks = elapsed / PENALTY_BLOCK_SECONDS;
        long earnedScore = Math.max(0L, (long) baseScore - blocks);

        // save earned score per problem
        redis.opsForHash().put(problemScoresKey(userBaseKey), problemId, String.valueOf(earnedScore));

        // update totals
        redis.opsForHash().increment(userBaseKey, "score", earnedScore);
        redis.opsForHash().increment(userBaseKey, "penalty", elapsed);

        long totalScore = getLong(userBaseKey, "score");
        long totalPenalty = getLong(userBaseKey, "penalty");

        long zScore = totalScore * SCORE_WEIGHT - totalPenalty;
        redis.opsForZSet().add(leaderboardKey(contestId), userId.toString(), zScore);
    }

    @Override
    public DashBoardPageResponseDto getDashBoard(Long contestId, int offset, int limit) {
        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND, "Dashboard"));

        if (contestService.isContestRunning(contestId)) {
            return getDashBoardRunning(contestId, offset, limit);
        }
        if (Boolean.TRUE.equals(contestService.isContestFinished(contestId))) {
            return getDashBoardFinished(contestId, offset, limit);
        }

        throw new IllegalStateException("Dashboard not available for contest status: " + contest.getContestStatus());
    }

    @Override
    public DashBoardPageResponseDto getDashBoardRunning(Long contestId, int offset, int limit) {
        if (limit <= 0) {
            return DashBoardPageResponseDto.builder().total(0L).items(List.of()).build();
        }

        String lbKey = leaderboardKey(contestId);

        Long total = redis.opsForZSet().size(lbKey);
        if (total == null || total == 0) {
            return DashBoardPageResponseDto.builder().total(0L).items(List.of()).build();
        }

        Set<String> userIdStrSet = redis.opsForZSet()
                .reverseRange(lbKey, offset, offset + limit - 1);

        if (userIdStrSet == null || userIdStrSet.isEmpty()) {
            return DashBoardPageResponseDto.builder().total(total).items(List.of()).build();
        }

        List<Long> userIds = userIdStrSet.stream().map(Long::valueOf).toList();
        Map<Long, String> userNameMap = userService.getUserNames(userIds);

        List<DashBoardItemResponseDto> items = new ArrayList<>(userIds.size());

        IntStream.range(0, userIds.size()).forEach(i -> {
            Long userId = userIds.get(i);
            long rank = (long) offset + i + 1;

            String baseKey = userBaseKey(contestId, userId);

            long totalScore = getLong(baseKey, "score");
            long penalty = getLong(baseKey, "penalty");

            List<SolvedProblemDto> solvedProblems = getSolvedProblems(baseKey);

            items.add(DashBoardItemResponseDto.builder()
                    .userId(userId)
                    .userName(userNameMap.getOrDefault(userId, ""))
                    .score((int) totalScore)
                    .penalty((int) penalty)
                    .rank(rank)
                    .solvedProblems(solvedProblems)
                    .build());
        });

        return DashBoardPageResponseDto.builder()
                .total(total)
                .items(items)
                .build();
    }

    @Override
    public DashBoardPageResponseDto getDashBoardFinished(Long contestId, int offset, int limit) {
        if (limit <= 0) {
            return DashBoardPageResponseDto.builder().total(0L).items(List.of()).build();
        }

        Pageable pageable = PageRequest.of(offset / limit, limit);
        Page<ContestParticipantsEntity> page =
                contestParticipantsRepo.findByContestIdOrderByRankingAsc(contestId, pageable);

        List<Long> userIds = page.getContent().stream()
                .map(ContestParticipantsEntity::getUserId)
                .toList();

        Map<Long, String> userNameMap = userService.getUserNames(userIds);

        List<DashBoardItemResponseDto> items = page.getContent().stream()
                .map(e -> mapToDashboardItem(e, userNameMap.getOrDefault(e.getUserId(), "")))
                .toList();

        return DashBoardPageResponseDto.builder()
                .items(items)
                .total(page.getTotalElements())
                .build();
    }

    // ---------------- helpers ----------------

    private List<SolvedProblemDto> getSolvedProblems(String userBaseKey) {
        Set<String> solvedIds = redis.opsForSet().members(acProblemsKey(userBaseKey));
        if (solvedIds == null || solvedIds.isEmpty()) return List.of();

        // multiGet earned scores
        List<Object> fields = new ArrayList<>(solvedIds.size());
        fields.addAll(solvedIds);

        List<Object> values = redis.opsForHash().multiGet(problemScoresKey(userBaseKey), fields);
        if (values == null) values = Collections.nCopies(fields.size(), null);

        List<SolvedProblemDto> result = new ArrayList<>(solvedIds.size());
        int idx = 0;
        for (String pid : solvedIds) {
            Object v = values.size() > idx ? values.get(idx) : null;
            long earnedScore = (v == null) ? 0L : Long.parseLong(v.toString());
            result.add(SolvedProblemDto.builder().problemId(pid).score(earnedScore).build());
            idx++;
        }
        return result;
    }

    private long getLong(String key, String field) {
        Object val = redis.opsForHash().get(key, field);
        return val == null ? 0L : Long.parseLong(val.toString());
    }

    private String userBaseKey(Long contestId, Long userId) {
        return "contest:" + contestId + ":user:" + userId;
    }

    private String leaderboardKey(Long contestId) {
        return "contest:" + contestId + ":leaderboard";
    }

    private String acProblemsKey(String userBaseKey) {
        return userBaseKey + ":ac_problems";
    }

    private String problemScoresKey(String userBaseKey) {
        return userBaseKey + ":problem_scores";
    }

    private DashBoardItemResponseDto mapToDashboardItem(ContestParticipantsEntity e, String userName) {
        return DashBoardItemResponseDto.builder()
                .userId(e.getUserId())
                .userName(userName)
                .score(e.getTotalScore())
                .penalty(e.getPenalty())
                .rank((long) e.getRanking())
                .solvedProblems(parseSolvedProblems(e.getSolvedProblem()))
                .build();
    }

    private List<SolvedProblemDto> parseSolvedProblems(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return objectMapper.readValue(json, new TypeReference<List<SolvedProblemDto>>() {});
        } catch (Exception e) {
            log.error("Parse solvedProblem failed", e);
            return List.of();
        }
    }
}
