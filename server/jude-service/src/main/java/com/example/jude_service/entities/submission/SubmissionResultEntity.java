package com.example.jude_service.entities.submission;

import com.example.jude_service.enums.ResponseStatus;
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
