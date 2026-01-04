package com.example.jude_service.entities.problem;

import com.example.jude_service.entities.testcase.TestcaseEntity;
import com.example.jude_service.enums.LanguageType;
import com.example.jude_service.enums.ProblemLevel;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "problem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ProblemEntity {
    @Id
    private String problemId;

    private Long contestId;

    @NotNull
    private String title;
    /**
     * đề bài (description) bao gồm:
     * 1. nội dung đề bài
     * 2. mô tả đầu vào, đầu ra
     * 3. test case mẫu
     * 4. các ràng buộc (ràng buộc phải khớp với dữ liệu gửi xuống DB)
     */
    @NotNull
    private String description; // de bai, chi luu url vao minio, dinh dang markdown

    private List<String> tags; // ví dụ như Backtrack, Dynamic Programing, ...
    private List<String> imageUrls; // hinfh anh dinh kem de bai, hinh anh duoc su dung trong de bai

    @Builder.Default
    private ProblemLevel level = ProblemLevel.EASY;

    @NotNull
    private List<LanguageType> supportedLanguage;

    private String solution;
    private String rating;
    private Integer score; // luu diem ma nguoi dung co the nhan duoc sau khi pass

    @NotNull
    private Double timeLimit; // giây
    private Double memoryLimit;

    @Builder.Default
    private String inputType = "stdin"; //stdin

    @Builder.Default
    private String outputType = "stdout"; //stdout
    // 2 trường inputType và outputType cần xem xét thêm vì có thể gán mặc định là stdin/stdout, nhưng cần xem xét thêm đối với các ngôn ngữ như java, python, javascript

    private Long authorId;
    private List<TestcaseEntity> testcaseEntities;

    private Boolean isActive;

    private Long createdBy;
    private Long lastModifiedBy;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;

}
