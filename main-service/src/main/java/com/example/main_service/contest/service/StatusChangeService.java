package com.example.main_service.contest.service;

import com.example.main_service.contest.model.ContestEntity;
import com.example.main_service.sharedAttribute.enums.ContestStatus;
import com.example.main_service.sharedAttribute.enums.ContestType;
import com.example.main_service.sharedAttribute.enums.ContestVisibility;
import com.example.main_service.sharedAttribute.enums.InviteStatus;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusChangeService {
    ContestVisibility changeContestVisibility(ContestVisibility visibility, ContestEntity contest);
    ContestStatus changeContestStatus(ContestStatus status, ContestEntity contest);
    ContestType changeContestType(ContestType type, ContestEntity contest);
    InviteStatus changeInviteStatus(InviteStatus status, ContestEntity contest);
}
