package com.example.main_service.contest.dto.contest;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ContestDetailDto extends ContestSummaryDto{
    private List<Long> problems; // list problemId
}
