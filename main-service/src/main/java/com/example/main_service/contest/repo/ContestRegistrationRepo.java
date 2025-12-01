package com.example.main_service.contest.repo;

import com.example.main_service.contest.model.ContestRegistrationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContestRegistrationRepo extends JpaRepository<ContestRegistrationEntity, Long> {
}
