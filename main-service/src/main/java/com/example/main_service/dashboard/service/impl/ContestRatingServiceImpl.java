package com.example.main_service.dashboard.service.impl;

import com.example.main_service.contest.model.ContestParticipantsEntity;
import com.example.main_service.contest.repo.ContestParticipantsRepo;
import com.example.main_service.dashboard.dtos.ContestRatingCalcResponseDto;
import com.example.main_service.dashboard.dtos.SolvedProblemDto;
import com.example.main_service.dashboard.service.ContestRatingService;
import com.example.main_service.user.model.UserRatingHistoryEntity;
import com.example.main_service.user.service.UserService;
import lombok.*;
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
    private final UserService userService;
    private final ContestParticipantsRepo contestParticipantRepo;
    private final ObjectMapper objectMapper;

    private static final int K = 32;

    @Transactional
    @Override
    public ContestRatingCalcResponseDto calculateRating(Long contestId) {

        String leaderboardKey = "contest:" + contestId + ":leaderboard";

        // lấy full ranking từ redis (rank 1 -> N)
        Set<String> userIds = redis.opsForZSet()
                .reverseRange(leaderboardKey, 0, -1);

        if (userIds == null || userIds.isEmpty()) {
            return new ContestRatingCalcResponseDto(contestId, false, 0);
        }

        int totalUsers = userIds.size();
        double expectedRank = (totalUsers + 1) / 2.0;

        int rank = 1;
        int affectedUsers = 0;

        for (String userIdStr : userIds) {

            Long userId = Long.valueOf(userIdStr);
            String baseKey = "contest:" + contestId + ":user:" + userId;

            // ===== LẤY SNAPSHOT TỪ REDIS =====
            int totalScore = getInt(baseKey, "score");   // tổng earnedScore
            int penalty = getInt(baseKey, "penalty");

            // ===== GHI contest_participants =====
            List<SolvedProblemDto> solvedProblems = getSolvedProblemsFromRedis(contestId, userId);
            String solvedJson = serializeSolvedProblems(solvedProblems);

            ContestParticipantsEntity participant = new ContestParticipantsEntity();
            participant.setContestId(contestId);
            participant.setUserId(userId);
            participant.setTotalScore(totalScore);
            participant.setPenalty(penalty);
            participant.setRanking(rank);
            participant.setSolvedProblem(solvedJson); // 👈 thêm dòng này
            contestParticipantRepo.save(participant);

            // ===== TÍNH RATING =====

            int currentRating = userService.findRatingByUserId(userId);
            int delta = (int) Math.round(
                    K * (expectedRank - rank) / expectedRank
            );

            int newRating = Math.max(0, currentRating + delta);

            // ===== GHI user_rating_history =====
            UserRatingHistoryEntity history = new UserRatingHistoryEntity();
            history.setUserId(userId);
            history.setContestId(contestId);
            history.setRating(newRating);
            history.setDelta(delta);

            userService.addRatingHistory(history);

            rank++;
            affectedUsers++;
        }

        // ===== XÓA REDIS CONTEST =====
        cleanupRedis(contestId);

        return new ContestRatingCalcResponseDto(
                contestId,
                true,
                affectedUsers
        );
    }

    private List<SolvedProblemDto> getSolvedProblemsFromRedis(Long contestId, Long userId) {
        String scoreKey = "contest:" + contestId + ":user:" + userId + ":problem_scores";

        Map<Object, Object> problemScoreMap = redis.opsForHash().entries(scoreKey);
        List<SolvedProblemDto> result = new ArrayList<>();

        for (Map.Entry<Object, Object> entry : problemScoreMap.entrySet()) {
            String problemId = entry.getKey().toString();
            long score = Long.parseLong(entry.getValue().toString());

            result.add(SolvedProblemDto.builder()
                    .problemId(problemId)
                    .score(score)
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


    private int getInt(String key, String field) {
        String v = (String) redis.opsForHash().get(key, field);
        return v == null ? 0 : Integer.parseInt(v);
    }

    private void cleanupRedis(Long contestId) {
        redis.delete("contest:" + contestId + ":leaderboard");

        Set<String> keys = redis.keys("contest:" + contestId + ":user:*");
        if (keys != null && !keys.isEmpty()) {
            redis.delete(keys);
        }
    }
}

