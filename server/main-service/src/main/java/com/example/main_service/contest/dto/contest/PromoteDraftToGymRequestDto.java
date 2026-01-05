package com.example.main_service.contest.dto.contest;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PromoteDraftToGymRequestDto {
    @JsonProperty("contest_id")
    private Long contestId;

    @JsonProperty("make_public")
    private Boolean makePublic;

    @JsonProperty("start_time")
    private LocalDateTime startTime;

    @JsonProperty("duration")
    private Integer duration;
}
