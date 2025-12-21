package com.example.main_service.contest.service;

import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.contest.dto.contest.*;
import com.example.main_service.contest.model.ContestEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface ContestService {
    ContestCreateUpdateResponseDto createContest(ContestCreateUpdateRequestDto input);
    ContestCreateUpdateResponseDto updateContest(Long contestId, ContestCreateUpdateRequestDto input);
    PageResult<ContestEntity> search(PageRequestDto<ContestFilterDto> input);
    ContestDetailDto getById(Long contestId);
    void deleteContest(Long contestId);
    PromoteDraftToGymResponseDto promoteDraft(Long contestId, PromoteDraftToGymRequestDto input);
    Boolean isContestRunning(Long contestId);
    Boolean isContestPublic(Long contestId);
    Boolean isUserRegistered(Long contestId,Long userId);
    Boolean isContestFinished(Long contestId);
    Boolean isContestUpcoming(Long contestId);
    Boolean canUserSubmit(Long contestId,Long userId);
    Long getContestStartTime(Long contestId);
    void promoteDraftToOfficial(Long contestId, ContestMakeOfficialRequestDto input);
    public void assignReviewer(Long contestId, Long reviewerId);

}
