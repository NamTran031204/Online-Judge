package com.example.jude_service.services.impl;

import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.entities.problem.ProblemEntity;
import com.example.jude_service.entities.problem.ProblemInputDto;
import com.example.jude_service.entities.problem.ProblemResponse;
import com.example.jude_service.repo.ProblemRepo;
import com.example.jude_service.services.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepo problemRepo;

    @Override
    public CommonResponse<ProblemEntity> addProblem(ProblemInputDto input) {
        ProblemEntity entity = ProblemEntity.builder()
                .title(input.getTitle())
                .description(input.getDescription())
                .tags(input.getTags())
                .imageUrls(input.getImageUrls())
                .level(input.getLevel())
                .supportedLanguage(input.getSupportedLanguage())
                .solution(input.getSolution())
                .rating(input.getRating())
                .score(input.getScore())
                .timeLimit(input.getTimeLimit())
                .memoryLimit(input.getMemoryLimit())
                .inputType(input.getInputType())
                .outputType(input.getOutputType())
                .authorId(input.getUserId())
                .testcaseEntities(input.getTestcaseEntities())
                .createdBy(input.getUserId())
                .lastModifiedBy(input.getUserId())
                .build();
        problemRepo.save(entity);
        return CommonResponse.success(entity);
    }


    ProblemResponse map(ProblemEntity entity) {
        return ProblemResponse.builder()
                .problemId(entity.getProblemId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .tags(entity.getTags())
                .imageUrls(entity.getImageUrls())
                .level(entity.getLevel())
                .supportedLanguage(entity.getSupportedLanguage())
                .solution(entity.getSolution())
                .rating(entity.getRating())
                .score(entity.getScore())
                .timeLimit(entity.getTimeLimit())
                .memoryLimit(entity.getMemoryLimit())
                .inputType(entity.getInputType())
                .outputType(entity.getOutputType())
                .authorId(entity.getAuthorId())
                .testcaseEntities(entity.getTestcaseEntities())
                .createdAt(entity.getCreatedAt())
                .createdBy(entity.getCreatedBy())
                .lastModifiedDate(entity.getLastModifiedDate())
                .lastModifiedBy(entity.getLastModifiedBy())
                .build();
    }

}
