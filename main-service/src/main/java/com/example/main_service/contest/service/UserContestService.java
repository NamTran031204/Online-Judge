package com.example.main_service.contest.service;

import com.example.main_service.contest.dto.contest.PromoteDraftToGymRequestDto;
import com.example.main_service.contest.dto.contest.PromoteDraftToGymResponseDto;
import com.example.main_service.contest.dto.userContest.ContestParticipantFilterDto;
import com.example.main_service.contest.dto.userContest.ContestParticipantResponseDto;
import com.example.main_service.contest.dto.userContest.ContestRegistrationFilterDto;
import com.example.main_service.contest.dto.userContest.ContestRegistrationResponseDto;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;

public interface UserContestService {
    ContestRegistrationResponseDto registerUser(Long contestId);
    PageResult<ContestRegistrationResponseDto> getRegistration(Long contestId, PageRequestDto<ContestRegistrationFilterDto> input);

    PageResult<ContestParticipantResponseDto> getParticipants(Long contestId, PageRequestDto<ContestParticipantFilterDto> input);
}
