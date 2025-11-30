package com.example.jude_service.entities.problem;

import com.example.jude_service.entities.testcase.TestcaseEntity;
import com.example.jude_service.enums.LanguageType;
import com.example.jude_service.enums.ProblemLevel;
import lombok.Data;

import java.util.List;

@Data
public class ProblemInputDto {

    private String title;
    private String contestId;
    private String description;
    private List<String> tags;
    private List<String> imageUrls; // tam thoi phong an :))
    private ProblemLevel level;

    private List<LanguageType> supportedLanguage;

    private String solution; // tam thoi xu ly String, sau nay la luu file
    private String rating;
    private Integer score;

    private Double timeLimit;
    private Double memoryLimit;
    private String inputType; //stdin
    private String outputType; //stdout

    private List<TestcaseEntity> testcaseEntities;

    private String userId;
}
