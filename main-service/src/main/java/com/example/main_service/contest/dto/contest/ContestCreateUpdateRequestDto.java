package com.example.main_service.contest.dto.contest;

import com.example.main_service.contest.enums.ContestType;
import com.example.main_service.contest.enums.ContestVisibility;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ContestCreateUpdateRequestDto {
    private String title;
    private String description;

    @JsonProperty("start_date")
    private LocalDate startDate;

    private Integer duration;

    @JsonProperty("contest_type")
    private ContestType contestType;

    private ContestVisibility visibility;

    @JsonProperty("group_id")
    private Long groupId;
}
