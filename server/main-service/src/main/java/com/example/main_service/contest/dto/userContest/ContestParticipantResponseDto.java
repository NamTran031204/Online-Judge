package com.example.main_service.contest.dto.userContest;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContestParticipantResponseDto {

    @JsonProperty("contest_id")
    private Long contestId;

    @JsonProperty("user_id")
    private Long userId;

    private String userName;
    private Integer penalty;

    @JsonProperty("total_score")
    private Integer totalScore;

    private Integer ranking;
}
