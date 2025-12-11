package com.example.main_service.contest.repo;

import com.example.main_service.contest.model.ContestProblemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ContestProblemRepo extends JpaRepository<ContestProblemEntity, Long> {
    Optional<ContestProblemEntity> findByContestIdAndProblemId(Long contestId, String problemId);

    @Query(value = """
                SELECT c.author
                FROM contest_problem cp
                JOIN contest c ON cp.contest_id = c.contest_id
                WHERE cp.problem_id = :problemId
            """,nativeQuery = true)
    Optional<Long> findByProblemId(@Param("problemId") String problemId);
}
