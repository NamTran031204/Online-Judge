package com.example.main_service.dashboard.service.impl;

import com.example.main_service.contest.model.ContestParticipantsEntity;
import com.example.main_service.contest.repo.ContestParticipantsRepo;
import com.example.main_service.dashboard.dtos.ContestRatingCalcResponseDto;
import com.example.main_service.dashboard.dtos.SolvedProblemDto;
import com.example.main_service.dashboard.service.ContestRatingService;
import com.example.main_service.user.model.UserRatingHistoryEntity;
import com.example.main_service.user.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContestRatingServiceImpl implements ContestRatingService {

    private final StringRedisTemplate redis;
    private final UserServiceImpl userService;
    private final ContestParticipantsRepo contestParticipantRepo;
    private final ObjectMapper objectMapper;

    private static final int K = 32;

    @Transactional
    @Override
    public ContestRatingCalcResponseDto calculateRating(Long contestId) {

        String lbKey = leaderboardKey(contestId);

        // rank 1 -> N (desc score)
        Set<String> userIdStrs = redis.opsForZSet().reverseRange(lbKey, 0, -1);
        if (userIdStrs == null || userIdStrs.isEmpty()) {
            return new ContestRatingCalcResponseDto(contestId, false, 0);
        }

        List<Long> userIds = userIdStrs.stream().map(Long::valueOf).toList();
        int totalUsers = userIds.size();
        double expectedRank = (totalUsers + 1) / 2.0;

        List<ContestParticipantsEntity> participantsToSave = new ArrayList<>(totalUsers);
        int affectedUsers = 0;

        for (int i = 0; i < userIds.size(); i++) {
            Long userId = userIds.get(i);
            int rank = i + 1;

            String baseKey = userBaseKey(contestId, userId);
            Snapshot snapshot = getSnapshot(baseKey);

            String solvedJson = serializeSolvedProblems(getSolvedProblems(contestId, userId));

            participantsToSave.add(buildParticipant(
                    contestId, userId, snapshot.score, snapshot.penalty, rank, solvedJson
            ));

            // ===== rating calc (giữ công thức cũ của mày) =====
            int currentRating = userService.findRatingByUserId(userId);
            int delta = (int) Math.round(K * (expectedRank - rank) / expectedRank);
            int newRating = Math.max(0, currentRating + delta);

            userService.addRatingHistory(buildHistory(userId, contestId, newRating, delta));

            affectedUsers++;
        }

        contestParticipantRepo.saveAll(participantsToSave);

        cleanupRedis(contestId);

        return new ContestRatingCalcResponseDto(contestId, true, affectedUsers);
    }

    // ---------------- helpers ----------------

    private Snapshot getSnapshot(String baseKey) {
        // 1 call/hash thay vì 2 call get field
        List<Object> vals = redis.opsForHash().multiGet(baseKey, List.of("score", "penalty"));
        int score = parseInt(vals != null ? vals.get(0) : null);
        int penalty = parseInt(vals != null ? vals.get(1) : null);
        return new Snapshot(score, penalty);
    }

    private List<SolvedProblemDto> getSolvedProblems(Long contestId, Long userId) {
        String key = problemScoresKey(contestId, userId);

        Map<Object, Object> map = redis.opsForHash().entries(key);
        if (map == null || map.isEmpty()) return List.of();

        List<SolvedProblemDto> result = new ArrayList<>(map.size());
        for (var e : map.entrySet()) {
            result.add(SolvedProblemDto.builder()
                    .problemId(String.valueOf(e.getKey()))
                    .score(Long.parseLong(String.valueOf(e.getValue())))
                    .build());
        }
        return result;
    }

    private String serializeSolvedProblems(List<SolvedProblemDto> list) {
        try {
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            log.error("Failed to serialize solvedProblem list", e);
            return "[]";
        }
    }

    private ContestParticipantsEntity buildParticipant(
            Long contestId,
            Long userId,
            int totalScore,
            int penalty,
            int rank,
            String solvedJson
    ) {
        ContestParticipantsEntity p = new ContestParticipantsEntity();
        p.setContestId(contestId);
        p.setUserId(userId);
        p.setTotalScore(totalScore);
        p.setPenalty(penalty);
        p.setRanking(rank);
        p.setSolvedProblem(solvedJson);
        return p;
    }

    private UserRatingHistoryEntity buildHistory(Long userId, Long contestId, int rating, int delta) {
        UserRatingHistoryEntity h = new UserRatingHistoryEntity();
        h.setUserId(userId);
        h.setContestId(contestId);
        h.setRating(rating);
        h.setDelta(delta);
        return h;
    }

    private int parseInt(Object v) {
        if (v == null) return 0;
        return Integer.parseInt(String.valueOf(v));
    }

    private String leaderboardKey(Long contestId) {
        return "contest:" + contestId + ":leaderboard";
    }

    private String userBaseKey(Long contestId, Long userId) {
        return "contest:" + contestId + ":user:" + userId;
    }

    private String problemScoresKey(Long contestId, Long userId) {
        return userBaseKey(contestId, userId) + ":problem_scores";
    }

    private void cleanupRedis(Long contestId) {
        redis.delete(leaderboardKey(contestId));

        // NOTE: KEYS có thể nặng nếu dữ liệu lớn; nếu prod lớn thì nên đổi sang SCAN.
        Set<String> keys = redis.keys("contest:" + contestId + ":user:*");
        if (keys != null && !keys.isEmpty()) {
            redis.delete(keys);
        }
    }

    private record Snapshot(int score, int penalty) {}
}
