package com.example.main_service.contest.model;

import com.example.main_service.sharedAttribute.enums.Result;
import com.example.main_service.sharedAttribute.enums.SubmissionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "submission_result")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResultEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "contest_id")
    private Long contestId;

    @Column(name = "problem_id")
    private String problemId;

    @Enumerated(EnumType.STRING)
    private Result result;

    @Column(name = "submission_id")
    private String submissionId;

    @Enumerated(EnumType.STRING)
    private SubmissionStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
