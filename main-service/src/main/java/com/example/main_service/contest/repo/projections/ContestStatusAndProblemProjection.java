package com.example.main_service.contest.repo.projections;

import com.example.main_service.sharedAttribute.enums.ContestStatus;

import java.time.LocalDateTime;

public interface ContestStatusAndProblemProjection {
    Long getUserId();
    Long getProblemId();
    ContestStatus getContestStatus();
    LocalDateTime getStartTime();
    Integer getDuration();
}
