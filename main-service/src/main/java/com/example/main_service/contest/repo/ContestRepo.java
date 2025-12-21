package com.example.main_service.contest.repo;

import com.example.main_service.contest.model.ContestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ContestRepo extends JpaRepository<ContestEntity, Long>, JpaSpecificationExecutor<ContestEntity> {
    Boolean existsByAuthor(Long author);
    @Query("""
        select cp.problemId
        from ContestProblemEntity cp
        where cp.contestId = :contestId
    """)
    List<String> findProblemIdsByContestId(Long contestId);
}
