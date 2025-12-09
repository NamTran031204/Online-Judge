package com.example.main_service.contest.repo.projections;

import java.time.LocalDateTime;

public interface ContestRegistrationProjection {
    Long getContestId();
    Long getUserId();
    String getUserName();
    LocalDateTime getRegisteredAt();
}
