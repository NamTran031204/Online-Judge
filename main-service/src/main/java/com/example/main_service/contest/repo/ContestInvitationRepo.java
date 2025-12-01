package com.example.main_service.contest.repo;

import com.example.main_service.contest.model.ContestInvitationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContestInvitationRepo extends JpaRepository<ContestInvitationEntity, Long> {
}
