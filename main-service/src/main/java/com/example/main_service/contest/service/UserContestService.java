package com.example.main_service.contest.service;

import com.example.main_service.contest.dto.userContest.ContestRegistrationResponseDto;

public interface UserContestService {
    ContestRegistrationResponseDto registerUser(Long contestId);
}
