package com.example.jude_service.entities.judge;

import com.example.jude_service.enums.ResponseStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCaseResult {
    private String testCaseId;
    private ResponseStatus verdict;
    private Float executionTime; // milliseconds
    private Long memoryUsed; // KB
    private String actualOutput;
    private String expectedOutput;
    private String errorMessage;
}