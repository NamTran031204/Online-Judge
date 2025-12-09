package com.example.main_service.contest.dto.contest;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PromoteDraftToGymRequestDto {
    @JsonProperty("contest_id")
    private Long contestId;

    @JsonProperty("make_public")
    private Boolean makePublic;
}
