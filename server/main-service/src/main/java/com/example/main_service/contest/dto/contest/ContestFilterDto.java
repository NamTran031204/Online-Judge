package com.example.main_service.contest.dto.contest;

import com.example.main_service.sharedAttribute.enums.ContestStatus;
import com.example.main_service.sharedAttribute.enums.ContestType;
import com.example.main_service.sharedAttribute.enums.ContestVisibility;
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
