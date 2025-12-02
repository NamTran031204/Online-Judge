package com.example.main_service.contest.controller;

import com.example.main_service.contest.dto.CommonResponse;
import com.example.main_service.contest.dto.userContest.ContestRegistrationResponseDto;
import com.example.main_service.contest.service.UserContestService;
import lombok.RequiredArgsConstructor;
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
}
