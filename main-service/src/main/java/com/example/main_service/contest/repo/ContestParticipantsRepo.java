package com.example.main_service.contest.repo;

import com.example.main_service.contest.model.ContestParticipantsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContestParticipantsRepo extends JpaRepository<ContestParticipantsEntity, Long> {
}
