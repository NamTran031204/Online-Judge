package com.example.main_service.submission.dto;

import com.example.main_service.sharedAttribute.enums.ResponseStatus;
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
    private ResponseStatus status;
    private Float time;
    private Float memory;
}
