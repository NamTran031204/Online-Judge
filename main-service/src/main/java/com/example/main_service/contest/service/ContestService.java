package com.example.main_service.contest.service;

import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.contest.dto.contest.*;
import com.example.main_service.contest.model.ContestEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface ContestService {
    ContestCreateUpdateResponseDto createDraftContest(Long userId,ContestCreateUpdateRequestDto input);
    ContestCreateUpdateResponseDto updateContest(Long userId,Long contestId, ContestCreateUpdateRequestDto input);
    PageResult<ContestEntity> search(Long userId,PageRequestDto<ContestFilterDto> input);
    ContestDetailDto getContestDetail(Long userId,Long contestId);
    void deleteContest(Long userId,Long contestId);
    void assignReviewer(Long userId,Long contestId, Long reviewerId);
    PromoteDraftToGymResponseDto promoteDraftToGym(Long userId,Long contestId, PromoteDraftToGymRequestDto input);
    void promoteDraftToOfficial(Long userId,Long contestId, PromoteDraftToOfficialRequestDto input);

    Boolean isContestRunning(Long contestId);
    Boolean isContestPublic(Long contestId);
    Boolean isUserRegistered(Long contestId,Long userId);
    Boolean isContestFinished(Long contestId);
    Boolean isContestUpcoming(Long contestId);
    Boolean canViewProblemInContest(Long userId,ContestEntity contest);
    Long getContestStartTime(Long contestId);
    Boolean canUserSubmit(Long contestId, Long userId);
}
