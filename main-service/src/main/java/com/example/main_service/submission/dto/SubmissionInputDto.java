package com.example.main_service.submission.dto;

import com.example.main_service.sharedAttribute.enums.LanguageType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionInputDto {
    private String problemId;
    private Long contestId;
    private Long userId;
    private String sourceCode; // hiện tại vẫn lưu string trong csdl, sau thì lưu url source code
    @JsonProperty("lang")
    private LanguageType language;
}
