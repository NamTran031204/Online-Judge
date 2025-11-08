package com.example.jude_service.entities.submission;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SubmissionResultEntity {
    private String testcaseName;
    private String input;
    private String output;
    private Float time;
    private Float memory;
}
