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
import com.example.main_service.sharedAttribute.enums.ContestStatus;
import com.example.main_service.sharedAttribute.exceptions.ErrorCode;
import com.example.main_service.sharedAttribute.exceptions.specException.ContestBusinessException;
import com.example.main_service.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import com.example.main_service.problem.ProblemGrpcClient;
import tools.jackson.core.ObjectReadContext;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

//contest:{contestId}:leaderboard (type:ZSET, member:userId, score:scoreweight-penalty)
//contest:{contestId}:user:{userId} (type:HASH, field: {score,penalty})

@Slf4j
@Service
@RequiredArgsConstructor
public class DashBoardServiceImpl implements DashBoardService {

    private final StringRedisTemplate redis;
    private final ContestService contestService;
    private final ContestRepo contestRepo;
    private final ProblemGrpcClient problemGrpcClient;
    private final UserService userService;
    private final ObjectMapper objectMapper;
    private final ContestParticipantsRepo contestParticipantsRepo;

    private static final long SCORE_WEIGHT = 1_000_000_000L;

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

        // contest phải đang running (double-check an toàn)
        if (!contestService.isContestRunning(contestId)) return;

        String baseKey = baseKey(contestId, userId);
        String acSetKey = baseKey + ":ac_problems";

        log.info("=====Inside Dashboard Service===={}===={}",baseKey,acSetKey);

        // nếu bài này đã AC rồi → skip
        Boolean solved = redis.opsForSet()
                .isMember(acSetKey, problemId);

        if (Boolean.TRUE.equals(solved)) return;

        // đánh dấu đã AC
        redis.opsForSet().add(acSetKey, problemId);

        // base score của problem (cố định)
        int baseScore = problemGrpcClient.getProblemById(problemId).getData().getScore();

        // elapsed = thời điểm nộp - start contest (seconds)
        long contestStart = contestService.getContestStartTime(contestId);

        // tru theo block (30s)
        long elapsed = Math.max(0, submitTimeEpochSeconds - contestStart);
        long elapsedMinutes = elapsed / 30;
        long earnedScore = Math.max(0L, (long) baseScore - elapsedMinutes);

        // lưu earnedScore theo problem để dashboard show được
        redis.opsForHash().put(
                baseKey + ":problem_scores",
                problemId,
                String.valueOf(earnedScore)
        );

        // update tổng score = cộng earnedScore
        redis.opsForHash().increment(baseKey, "score", earnedScore);

        // penalty
        redis.opsForHash().increment(baseKey, "penalty", elapsed);

        /// ====Update vào leaderboard====
        long totalScore = getLong(baseKey, "score");      // tổng earnedScore
        long totalPenalty = getLong(baseKey, "penalty");  // tổng penalty
        long zScore = totalScore * SCORE_WEIGHT - totalPenalty;
        redis.opsForZSet().add(
                leaderboardKey(contestId),
                userId.toString(),
                zScore
        );
    }

    public DashBoardPageResponseDto getDashBoard(
            Long contestId,
            int offset,
            int limit
    ) {
        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND,"Dashboard"));

        if (contestService.isContestRunning(contestId)) {
            return getDashBoardRunning(contestId, offset, limit);
        }

        if (contestService.isContestFinished(contestId).equals(Boolean.TRUE)) {
            return getDashBoardFinished(contestId, offset, limit);
        }

        throw new IllegalStateException(
                "Dashboard not available for contest status: " + contest.getContestStatus()
        );
    }

    @Override
    public DashBoardPageResponseDto getDashBoardRunning(
            Long contestId,
            int offset,
            int limit
    ) {

        String leaderboardKey = leaderboardKey(contestId);

        Long total = redis.opsForZSet().size(leaderboardKey);
        if (total == null || total == 0) {
            return DashBoardPageResponseDto.builder()
                    .total(0L)
                    .items(List.of())
                    .build();
        }

        Set<String> userIds = redis.opsForZSet()
                .reverseRange(leaderboardKey, offset, offset + limit - 1);

        List<DashBoardItemResponseDto> items = new ArrayList<>();

        if (userIds != null) {
            for (String userIdStr : userIds) {

                Long userId = Long.valueOf(userIdStr);
                String baseKey = baseKey(contestId, userId);

                long totalScore = getLong(baseKey, "score");
                long penalty = getLong(baseKey, "penalty");
                long finalScore = Math.max(0, totalScore - penalty);

                long rank = redis.opsForZSet()
                        .reverseRank(leaderboardKey, userIdStr) + 1;

                String userName = userService.getUserName(userId);

                // ===== lấy danh sách bài đã AC =====
                Set<String> solvedProblemIds =
                        redis.opsForSet().members(baseKey + ":ac_problems");

                List<SolvedProblemDto> solvedProblems = new ArrayList<>();

                if (solvedProblemIds != null) {
                    for (Object pidObj : solvedProblemIds) {
                        String problemId = pidObj.toString();

                        // earnedScore của từng bài
                        String ps = (String) redis.opsForHash().get(
                                baseKey + ":problem_scores",
                                problemId
                        );

                        long earnedScore = ps == null ? 0L : Long.parseLong(ps);

                        solvedProblems.add(
                                SolvedProblemDto.builder()
                                        .problemId(problemId)
                                        .score(earnedScore)
                                        .build()
                        );
                    }
                }

                items.add(DashBoardItemResponseDto.builder()
                        .userId(userId)
                        .userName(userName)
                        .score((int) totalScore)
                        .penalty((int) penalty)
                        .rank(rank)
                        .solvedProblems(solvedProblems)
                        .build());
            }
        }

        return DashBoardPageResponseDto.builder()
                .total(total)
                .items(items)
                .build();
    }

    @Override
    public DashBoardPageResponseDto getDashBoardFinished(
            Long contestId,
            int offset,
            int limit
    ) {
        Pageable pageable = PageRequest.of(offset / limit, limit);

        Page<ContestParticipantsEntity> page =
                contestParticipantsRepo
                        .findByContestIdOrderByRankingAsc(contestId, pageable);

        List<Long> userIds = page.getContent().stream()
                .map(ContestParticipantsEntity::getUserId)
                .toList();

        Map<Long, String> userNameMap =
                userService.getUserNames(userIds); // batch

        List<DashBoardItemResponseDto> items = page.getContent().stream()
                .map(e -> mapToDashboardItem(
                        e,
                        userNameMap.get(e.getUserId())
                ))
                .toList();

        return DashBoardPageResponseDto.builder()
                .items(items)
                .total(page.getTotalElements())
                .build();
    }


    private long getLong(String key, String field) {
        String val = (String) redis.opsForHash().get(key, field);
        return val == null ? 0L : Long.parseLong(val);
    }

    private String baseKey(Long contestId, Long userId) {
        return "contest:" + contestId + ":user:" + userId;
    }

    private String leaderboardKey(Long contestId) {
        return "contest:" + contestId + ":leaderboard";
    }

    private DashBoardItemResponseDto mapToDashboardItem(
            ContestParticipantsEntity e,
            String userName
    ) {
        return DashBoardItemResponseDto.builder()
                .userId(e.getUserId())
                .userName(userName)
                .score(e.getTotalScore())
                .penalty(e.getPenalty())
                .rank(Long.valueOf(e.getRanking()))
                .solvedProblems(
                        parseSolvedProblems(e.getSolvedProblem())
                )
                .build();
    }

    private List<SolvedProblemDto> parseSolvedProblems(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(
                    json,
                    new TypeReference<List<SolvedProblemDto>>() {}
            );
        } catch (Exception e) {
            log.error("Parse solvedProblem failed", e);
            return List.of();
        }
    }

}

