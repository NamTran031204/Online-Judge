package com.example.main_service.contest.dto.contest;

import com.example.main_service.contest.enums.ContestStatus;
import com.example.main_service.contest.enums.ContestType;
import com.example.main_service.contest.enums.ContestVisibility;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ContestSummaryDto {
    @JsonProperty("contest_id")
    private Long contestId;

    private String title;
    private String description;

    @JsonProperty("start_time")
    private LocalDateTime startTime;

    private Integer duration;

    @JsonProperty("contest_status")
    private ContestStatus contestStatus;

    @JsonProperty("contest_type")
    private ContestType contestType;

    @JsonProperty("author_id")
    private Long authorId;

    private Long rated;

    private ContestVisibility visibility;

    @JsonProperty("group_id")
    private Long groupId;
}
