package com.example.main_service.contest.dto.contestProblem;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestProblemResponseDto {

    @Column(name = "contest_id")
    private Long contestId;

    @Column(name = "problem_id")
    private String problemId;
}
