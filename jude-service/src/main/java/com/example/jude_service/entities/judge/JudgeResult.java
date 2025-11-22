package com.example.jude_service.entities.judge;

import com.example.jude_service.enums.ResponseStatus;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JudgeResult {
    private String submissionId;
    private ResponseStatus finalVerdict;
    private Integer totalTestCases;
    private Integer passedTestCases;
    private Long totalExecutionTime; // milliseconds
    private Long maxMemoryUsed; // KB
    private List<TestCaseResult> testCaseResults;
    private String compileMessage;
}