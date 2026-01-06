package com.example.main_service.contest.repo.projections;

import com.example.main_service.sharedAttribute.enums.ContestStatus;
import com.example.main_service.sharedAttribute.enums.ContestType;
import com.example.main_service.sharedAttribute.enums.ContestVisibility;

public interface SubmissionDeleteValidationCheckProjection {
    Long getUserId();
    String getProblemId();
    Long getContestId();
    String getSubmissionId();
    ContestStatus getContestStatus();
    ContestType getContestType();
    ContestVisibility getContestVisibility();
    Long getRated();
    Long getAuthor();
    Long getGroupId();
    Long getScore();

}
