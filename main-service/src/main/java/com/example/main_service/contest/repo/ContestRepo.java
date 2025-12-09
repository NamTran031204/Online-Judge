package com.example.main_service.contest.repo;

import com.example.main_service.contest.model.ContestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ContestRepo extends JpaRepository<ContestEntity, Long>, JpaSpecificationExecutor<ContestEntity> {
    Boolean existsByAuthor(Long author);
    Boolean existsByContestIdAndAuthor(Long contestId, Long author);

    @Query("""
        SELECT ContestEntity
        From ContestEntity c
        JOIN ContestProblemEntity cp ON c.contestId = cp.contestId
        WHERE cp.problemId = :problemId
    """)
    Optional<ContestEntity> findContestByProblemId(@Param("problemId") String problemId);
}
