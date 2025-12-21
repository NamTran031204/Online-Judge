package com.example.main_service.dashboard.dtos;
import lombok.*;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SolvedProblemDto {
    private String problemId;
    private Long score;
}

