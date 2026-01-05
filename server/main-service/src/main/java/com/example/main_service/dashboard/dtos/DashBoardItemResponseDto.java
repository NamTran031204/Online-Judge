package com.example.main_service.dashboard.dtos;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashBoardItemResponseDto {

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("user_name")
    private String userName;

    private Integer score;

    private Integer penalty;

    private Long rank;

    private List<SolvedProblemDto> solvedProblems;
}


