package com.example.main_service.contest.service.impl;

import com.example.main_service.contest.dto.PageRequestDto;
import com.example.main_service.contest.dto.PageResult;
import com.example.main_service.contest.dto.contest.ContestCreateUpdateRequestDto;
import com.example.main_service.contest.dto.contest.ContestCreateUpdateResponseDto;
import com.example.main_service.contest.dto.contest.ContestDetailDto;
import com.example.main_service.contest.dto.contest.ContestSummaryDto;
import com.example.main_service.contest.service.ContestService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@Transactional
@RequiredArgsConstructor
public class ContestServiceImpl implements ContestService {



    @Override
    public ContestCreateUpdateResponseDto createContest(ContestCreateUpdateRequestDto input) {
        return null;
    }

    @Override
    public ContestCreateUpdateResponseDto updateContest(Long contestId, ContestCreateUpdateRequestDto input) {
        return null;
    }

    @Override
    public PageResult<ContestSummaryDto> search(PageRequestDto input) {
        return null;
    }

    @Override
    public ContestDetailDto getById(Long contestId) {
        return null;
    }

    @Override
    public void deleteContest(Long contestId) {

    }
}
