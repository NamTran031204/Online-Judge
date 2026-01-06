package com.example.main_service.contest.dto.contest;

import com.example.main_service.sharedAttribute.enums.ContestStatus;
import com.example.main_service.sharedAttribute.enums.ContestType;
import com.example.main_service.sharedAttribute.enums.ContestVisibility;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ContestSummaryDto {
    @JsonProperty("contest_id")
    private Long contestId;

    private String title;
    private String description;

    @JsonProperty("startTime")
    private LocalDateTime startTime;

    private Integer duration;

    @JsonProperty("contestStatus")
    private ContestStatus contestStatus;

    @JsonProperty("contestType")
    private ContestType contestType;

    @JsonProperty("authorId")
    private Long authorId;

    private Long rated;

    private ContestVisibility visibility;

    @JsonProperty("group_id")
    private Long groupId;
}
