package com.example.main_service.contest.dto.contest;

import com.example.main_service.contest.enums.ContestStatus;
import com.example.main_service.contest.enums.ContestType;
import com.example.main_service.contest.enums.ContestVisibility;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ContestFilterDto {
    private Long rated;

    @JsonProperty("contest_status")
    private ContestStatus contestStatus;

    @JsonProperty("contest_type")
    private ContestType contestType;

    private ContestVisibility visibility;

    @JsonProperty("group_id")
    private Long groupId;

    @JsonProperty("author_id")
    private Long authorId;
}
