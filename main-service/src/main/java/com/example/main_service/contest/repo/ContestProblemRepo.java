package com.example.main_service.contest.repo;

import com.example.main_service.contest.model.ContestProblemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContestProblemRepo extends JpaRepository<ContestProblemEntity, Long> {
}
