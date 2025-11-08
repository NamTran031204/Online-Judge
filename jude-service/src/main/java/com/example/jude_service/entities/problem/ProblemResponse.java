package com.example.jude_service.entities.problem;

import com.example.jude_service.entities.testcase.TestcaseEntity;
import com.example.jude_service.enums.LanguageType;
import com.example.jude_service.enums.ProblemLevel;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProblemResponse {
    private String problemId;
    private String title;
    private String description;
    private List<String> tags;
    private List<String> imageUrls;
    private ProblemLevel level;
    private List<LanguageType> supportedLanguage;


    private String solution;
    private String rating;
    private Integer score;

    private Double timeLimit;
    private Double memoryLimit;
    private String inputType; //stdin
    private String outputType; //stdout

    private String authorId;
    private List<TestcaseEntity> testcaseEntities;

    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedDate;

    private String createdBy;
    private String lastModifiedBy;
}
