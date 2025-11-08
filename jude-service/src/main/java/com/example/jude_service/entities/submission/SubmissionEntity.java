package com.example.jude_service.entities.submission;

import com.example.jude_service.enums.LanguageType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "submission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SubmissionEntity {
    @Id
    private String submissionId;

    private String problemId;
    private String contestId;
    private String sourceCode; // lưu url
    private LanguageType language;

    private LocalDateTime submittedAt;
    private List<SubmissionResultEntity> result;
}
