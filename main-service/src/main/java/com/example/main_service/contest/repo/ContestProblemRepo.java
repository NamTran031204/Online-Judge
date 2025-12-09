package com.example.main_service.contest.repo;

import com.example.main_service.contest.model.ContestProblemEntity;
import com.example.main_service.contest.repo.projections.ContestStatusAndProblemProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContestProblemRepo extends JpaRepository<ContestProblemEntity, Long> {
    Optional<ContestProblemEntity> findByContestIdAndProblemId(Long contestId, String problemId);

    @Query(value = """
        SELECT c.author
        FROM contest_problem cp
        JOIN contest c ON cp.contest_id = c.contest_id
        WHERE cp.problem_id = :problemId
    """, nativeQuery = true)
    Optional<Long> findContestAuthorByProblemId(@Param("problemId") String problemId);

    @Query(value = """
        SELECT 
            cr.user_id AS userId,
            cp.problem_id AS problemId,
            c.contest_status AS contestStatus,
            c.start_time AS startTime,
            c.duration AS duration
        FROM contest_problem cp
        JOIN contest c ON cp.contest_id = c.contest_id
        JOIN contest_registration cr ON cr.contest_id = cp.contest_id
        WHERE cp.problem_id = :problemId AND c.contest_id = :contestId
    """, nativeQuery = true)
    Optional<ContestStatusAndProblemProjection> findStatusAndUserId(@Param("problemId") String problemId, @Param("contestId") Long contestId);

    Optional<ContestProblemEntity> findByProblemIdAndContestId(String problemId, Long contestId);

    Optional<ContestProblemEntity> findByProblemId(String problemId);
}
