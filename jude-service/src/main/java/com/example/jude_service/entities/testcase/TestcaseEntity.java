package com.example.jude_service.entities.testcase;

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
