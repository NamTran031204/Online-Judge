package com.example.main_service.contest.dto.contestProblem;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
public class RearrangeContestProblemRequestDto {
    private List<String> problemIds;
}
