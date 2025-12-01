package com.example.main_service.contest.service;

import com.example.main_service.contest.dto.CommonResponse;
import com.example.main_service.contest.dto.PageRequestDto;
import com.example.main_service.contest.dto.PageResult;
import com.example.main_service.contest.dto.contest.ContestCreateUpdateRequestDto;
import com.example.main_service.contest.dto.contest.ContestCreateUpdateResponseDto;
import com.example.main_service.contest.dto.contest.ContestDetailDto;
import com.example.main_service.contest.dto.contest.ContestSummaryDto;

public interface ContestService {
    ContestCreateUpdateResponseDto createContest(ContestCreateUpdateRequestDto input);
    ContestCreateUpdateResponseDto updateContest(Long contestId, ContestCreateUpdateRequestDto input);
    PageResult<ContestSummaryDto> search(PageRequestDto input);
    ContestDetailDto getById(Long contestId);
    void deleteContest(Long contestId);
}
