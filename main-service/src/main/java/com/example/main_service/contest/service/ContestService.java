package com.example.main_service.contest.service;

import com.example.main_service.contest.dto.CommonResponse;
import com.example.main_service.contest.dto.PageRequestDto;
import com.example.main_service.contest.dto.PageResult;
import com.example.main_service.contest.dto.contest.*;
import com.example.main_service.contest.model.ContestEntity;

public interface ContestService {
    ContestCreateUpdateResponseDto createContest(ContestCreateUpdateRequestDto input);
    ContestCreateUpdateResponseDto updateContest(Long contestId, ContestCreateUpdateRequestDto input);
    PageResult<ContestEntity> search(PageRequestDto<ContestFilterDto> input);
    ContestDetailDto getById(Long contestId);
    void deleteContest(Long contestId);
}
