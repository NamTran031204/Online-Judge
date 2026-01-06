package com.example.main_service.contest.dto.contest;

import com.example.main_service.sharedAttribute.enums.ContestType;
import com.example.main_service.sharedAttribute.enums.ContestVisibility;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ContestCreateUpdateRequestDto {
    private String title;
    private String description;

    private LocalDateTime startTime;

    private Integer duration;

    @JsonProperty("contest_type")
    private ContestType contestType;

    private Long rated;

    private ContestVisibility visibility;

    @JsonProperty("group_id")
    private Long groupId;
}
