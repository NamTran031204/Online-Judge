package com.example.main_service.submission.dto;

import com.example.main_service.sharedAttribute.enums.LanguageType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SubmissionEntity {
    private String submissionId;

    private String problemId;
    private Long contestId;
    private Long userId;
    private String sourceCode; // hiện tại vẫn lưu string trong csdl, sau thì lưu url source code thong qua tai len tai MinIO
    private LanguageType language;

    private LocalDateTime submittedAt;
    private List<SubmissionResultEntity> result;
}
