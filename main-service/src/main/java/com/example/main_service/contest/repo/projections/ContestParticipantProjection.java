package com.example.main_service.contest.repo.projections;

public interface ContestParticipantProjection {
    Long getContestId();
    Long getUserId();
    String getUserName();
    Integer getPenalty();
    Integer getTotalScore();
    Integer getRanking();
}