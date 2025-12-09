package com.example.main_service.contest.service;

import com.example.main_service.contest.dto.contest.ContestAttachProblemRequestDto;
import com.example.main_service.contest.dto.contestProblem.ContestProblemResponseDto;
import org.springframework.stereotype.Repository;

@Repository
public interface ContestProblemService {
    ContestProblemResponseDto addProblemToContest(Long contestId, ContestAttachProblemRequestDto input);
    void deleteProblemFromContest(Long contestId, String problemId);
}
