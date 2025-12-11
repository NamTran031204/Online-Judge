package com.example.main_service.contest.controller;

import com.example.main_service.contest.dto.contest.PromoteDraftToGymRequestDto;
import com.example.main_service.contest.dto.contest.PromoteDraftToGymResponseDto;
import com.example.main_service.contest.dto.userContest.*;
import com.example.main_service.contest.model.ContestRegistrationEntity;
import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.contest.service.UserContestService;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/contest")
@RequiredArgsConstructor
public class UserContestController {

    private final UserContestService userContestService;

    @PostMapping("/{contestId}/register")
    public CommonResponse<ContestRegistrationResponseDto> registerUserToContest(@PathVariable("contestId") Long contestId) {
        return CommonResponse.success(userContestService.registerUser(contestId));
    }

    @PostMapping("{contestId}/registrations/search")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'contest:view', 'Contest', #contestId)")
    public CommonResponse<PageResult<ContestRegistrationResponseDto>> getAllRegistration(
            @PathVariable("contestId") Long contestId,
            PageRequestDto<ContestRegistrationFilterDto> pageRequestDto
    ) {
        return CommonResponse.success(userContestService.getRegistration(contestId, pageRequestDto));
    }

    // làm dashboard thì hãn làm cái này
    @PostMapping("{contestId}/participants/search")
    public CommonResponse<PageResult<ContestParticipantResponseDto>> getAllParticipants(
            @PathVariable("contestId") Long contestId,
            PageRequestDto<ContestParticipantFilterDto> pageRequestDto
    ) {
        return CommonResponse.success(userContestService.getParticipants(contestId, pageRequestDto));
    }
}
