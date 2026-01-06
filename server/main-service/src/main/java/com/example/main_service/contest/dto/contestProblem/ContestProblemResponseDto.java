package com.example.main_service.contest.dto.contestProblem;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("contest_id")
    private Long contestId;

    @JsonProperty("problem_id")
    private String problemId;

    @JsonProperty("problem_label")
    private String problemLabel;

    @JsonProperty("problem_order")
    private Integer problemOrder;
}
