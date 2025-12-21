package com.example.main_service.dashboard.service;

import com.example.main_service.dashboard.dtos.DashBoardPageResponseDto;

public interface DashBoardService {

    void onSubmissionJudged(
            String submissionId,
            Long userId,
            Long contestId,
            String problemId,
            boolean allAccepted,
            long submitTimeEpochSeconds
    );

    public DashBoardPageResponseDto getDashBoard(
            Long contestId,
            int offset,
            int limit
    );

    public DashBoardPageResponseDto getDashBoardRunning(
            Long contestId,
            int offset,
            int limit
    );

    public DashBoardPageResponseDto getDashBoardFinished(
            Long contestId,
            int offset,
            int limit
    );
}
