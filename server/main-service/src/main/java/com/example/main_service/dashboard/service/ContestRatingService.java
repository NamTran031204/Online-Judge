package com.example.main_service.dashboard.service;

import com.example.main_service.dashboard.dtos.ContestRatingCalcResponseDto;

public interface ContestRatingService   {
    ContestRatingCalcResponseDto calculateRating(Long contestId);
}
