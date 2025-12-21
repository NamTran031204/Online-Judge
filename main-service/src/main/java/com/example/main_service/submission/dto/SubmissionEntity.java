package com.example.main_service.submission.dto;

import com.example.main_service.sharedAttribute.enums.LanguageType;
import com.example.main_service.sharedAttribute.enums.ResponseStatus;
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

    public boolean isAllAccepted() {
        if (result == null || result.isEmpty()) {
            return false;
        }
        return result
                .stream()
                .allMatch(r -> r.getStatus() == ResponseStatus.AC);
    }

}
