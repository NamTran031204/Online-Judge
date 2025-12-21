package com.example.main_service.contest.repo;

import com.example.main_service.contest.model.ContestParticipantsEntity;
import com.example.main_service.contest.repo.projections.ContestParticipantProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContestParticipantsRepo extends JpaRepository<ContestParticipantsEntity, Long> {
    boolean existsByContestId(Long contestId);

    @Query(value = """
        SELECT cp.contest_id AS contestId, cp.user_id AS userId, ud.user_name AS userName, 
               cp.penalty AS penalty, cp.total_score AS totalScore, cp.ranking AS ranking
        FROM contest_participants cp
        JOIN user_details ud ON cp.user_id = ud.user_id
        WHERE cp.contest_id = :contestId
    """, nativeQuery = true)
    Page<ContestParticipantProjection> findByContestId(@Param("contestId") Long contestId, Pageable pageable);

    @Query(value = """
        SELECT cp.contest_id AS contestId, cp.user_id AS userId, ud.user_name AS userName, 
               cp.penalty AS penalty, cp.total_score AS totalScore, cp.ranking AS ranking
        FROM contest_participants cp
        JOIN user_details ud ON cp.user_id = ud.user_id
        WHERE cp.contest_id = :contestId AND cp.user_id = :userId
    """, nativeQuery = true)
    Page<ContestParticipantProjection> findByContestIdAndUserId(@Param("contestId") Long contestId, @Param("userId") Long userId, Pageable pageable);

    Boolean existsByContestIdAndUserId(Long contestId, Long userId);

    Page<ContestParticipantsEntity> findByContestIdOrderByRankingAsc(Long contestId, Pageable pageable);

}
