package com.example.main_service.contest.repo;

import com.example.main_service.contest.model.ContestParticipantsEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContestParticipantsRepo extends JpaRepository<ContestParticipantsEntity, Long> {
    boolean existsByContestId(Long contestId);

    Page<ContestParticipantsEntity> findByContestIdOrderByRankingAsc(Long contestId, Pageable pageable);

}
