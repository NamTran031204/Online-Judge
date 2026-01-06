package com.example.main_service.contest.dto.userContest;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ContestRegistrationFilterDto {
    @JsonProperty("user_id")
    private Long userId;
}
