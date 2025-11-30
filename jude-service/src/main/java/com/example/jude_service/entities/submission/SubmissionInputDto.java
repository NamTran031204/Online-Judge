package com.example.jude_service.entities.submission;

import com.example.jude_service.enums.LanguageType;
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
    private String contestId;
    private String userId;
    private String sourceCode; // hiện tại vẫn lưu string trong csdl, sau thì lưu url source code
    private LanguageType language;
}
