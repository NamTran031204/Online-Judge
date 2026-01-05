package com.example.main_service.contest.service;

import com.example.main_service.contest.dto.userContest.ContestParticipantFilterDto;
import com.example.main_service.contest.dto.userContest.ContestParticipantResponseDto;
import com.example.main_service.contest.dto.userContest.ContestRegistrationFilterDto;
import com.example.main_service.contest.dto.userContest.ContestRegistrationResponseDto;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import org.springframework.stereotype.Repository;

@Repository
public interface UserContestService {
    ContestRegistrationResponseDto registerUser(Long contestId);
    PageResult<ContestRegistrationResponseDto> getRegistration(Long contestId, PageRequestDto<ContestRegistrationFilterDto> input);

    void unregisterUser(Long contestId,Long userId);
}
