package com.example.main_service.contest.dto.userContest;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ContestParticipantFilterDto {
    @JsonProperty("user_id")
    private Long userId;
}
