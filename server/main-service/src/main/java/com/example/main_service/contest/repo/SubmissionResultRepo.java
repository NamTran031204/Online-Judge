package com.example.main_service.contest.repo;

import com.example.main_service.contest.model.SubmissionResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionResultRepo extends JpaRepository<SubmissionResultEntity, Long> {
}
