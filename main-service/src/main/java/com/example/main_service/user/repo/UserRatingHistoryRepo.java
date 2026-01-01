package com.example.main_service.user.repo;

import com.example.main_service.user.model.UserRatingHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRatingHistoryRepo
        extends JpaRepository<UserRatingHistoryEntity, Long> {

    // lấy rating mới nhất của user
    Optional<UserRatingHistoryEntity> findFirstByUserIdOrderByContestIdDesc(Long userId);

    boolean existsByUserIdAndContestId(Long userId, Long contestId);

    List<UserRatingHistoryEntity> findByUserIdOrderByContestIdAsc(Long userId);
}

