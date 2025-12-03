package com.example.main_service.problem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class TestcaseEntity {
    private String testcaseName;
    private String input;
    private String output;
}
