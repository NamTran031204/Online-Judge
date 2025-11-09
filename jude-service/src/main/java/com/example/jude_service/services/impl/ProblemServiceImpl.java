package com.example.jude_service.services.impl;

import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.entities.PageRequestDto;
import com.example.jude_service.entities.PageResult;
import com.example.jude_service.entities.problem.ProblemEntity;
import com.example.jude_service.entities.problem.ProblemInputDto;
import com.example.jude_service.entities.problem.ProblemResponse;
import com.example.jude_service.entities.testcase.TestcaseEntity;
import com.example.jude_service.exceptions.ErrorCode;
import com.example.jude_service.exceptions.specException.ProblemBusinessException;
import com.example.jude_service.repo.ProblemRepo;
import com.example.jude_service.services.ProblemService;
import com.example.jude_service.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepo problemRepo;

    @Override
    public CommonResponse<ProblemEntity> addProblem(ProblemInputDto input) {
        validateBeforeInsertProblem(input);

        ProblemEntity entity = problemRepo.save(ProblemEntity.builder()
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
                .build());
        return CommonResponse.success(entity);
    }

    @Override
    public PageResult<CommonResponse<ProblemEntity>> getProblemPage(PageRequestDto input) {
        return null;
    }

    @Override
    public CommonResponse<ProblemEntity> getProblemById(String problemId) {
         ProblemEntity entity = problemRepo.findById(problemId.toString())
                .orElseThrow(() -> new ProblemBusinessException(ErrorCode.PROBLEM_NOT_FOUND));
         return CommonResponse.success(entity);
    }

    @Override
    public CommonResponse<ProblemEntity> updateProblem(ProblemInputDto input, String problemId) {
        ProblemEntity entity = problemRepo.findById(problemId.toString())
                .orElseThrow(() -> new ProblemBusinessException(ErrorCode.PROBLEM_NOT_FOUND));

        if (!StringUtils.isNullOrEmpty(input.getTitle())) {
            entity.setTitle(input.getTitle());
        }
        if (input.getTags() != null && !input.getTags().isEmpty()) {
            entity.setTags(input.getTags());
        }
        if (input.getImageUrls() != null && !input.getImageUrls().isEmpty()) {
            entity.setImageUrls(input.getImageUrls());
        }
        if (input.getLevel() != null) {
            entity.setLevel(input.getLevel());
        }
        if (input.getSupportedLanguage() != null && !input.getSupportedLanguage().isEmpty()) {
            entity.setSupportedLanguage(input.getSupportedLanguage());
        }
        if (!StringUtils.isNullOrEmpty(input.getSolution())) {
            entity.setSolution(input.getSolution());
        }
        if (!StringUtils.isNullOrEmpty(input.getRating())) {
            entity.setRating(input.getRating());
        }
        if (input.getScore() != null) {
            entity.setScore(input.getScore());
        }
        if (input.getTimeLimit() != null) {
            entity.setTimeLimit(input.getTimeLimit());
        }
        if (input.getMemoryLimit() != null) {
            entity.setMemoryLimit(input.getMemoryLimit());
        }
        if (!StringUtils.isNullOrEmpty(input.getInputType())) {
            entity.setInputType(input.getInputType());
        }
        if (!StringUtils.isNullOrEmpty(input.getOutputType())) {
            entity.setOutputType(input.getOutputType());
        }
        if (input.getTestcaseEntities() != null && !input.getTestcaseEntities().isEmpty()) {
            entity.setTestcaseEntities(
                    validateTestcaseEntities(input.getTestcaseEntities())
            );
        }
        if (!StringUtils.isNullOrEmpty(input.getUserId())) {
            entity.setLastModifiedBy(input.getUserId());
        }

        problemRepo.save(entity);
        return CommonResponse.success(entity);
    }

    @Override
    public CommonResponse<ProblemEntity> deleteProblem(String problemId) {
        if (problemRepo.existsById(problemId)) {
            problemRepo.deleteById(problemId);
            return CommonResponse.success();
        }
        return CommonResponse.fail(ErrorCode.PROBLEM_NOT_FOUND);
    }

    void validateBeforeInsertProblem(ProblemInputDto input) {
        if (StringUtils.isNullOrEmpty(input.getTitle())) {
            throw new ProblemBusinessException(ErrorCode.PROBLEM_VALIDATE);
        }
        if (StringUtils.isNullOrEmpty(input.getDescription())) {
            throw new ProblemBusinessException(ErrorCode.PROBLEM_VALIDATE);
        }
        if (input.getSupportedLanguage().isEmpty()) {
            throw new ProblemBusinessException(ErrorCode.PROBLEM_VALIDATE);
        }
    }

    List<TestcaseEntity> validateTestcaseEntities(List<TestcaseEntity> input) {
        List<TestcaseEntity> result = new ArrayList<>();
        Set<String> set = new HashSet<String>();
        for (var e: input) {
            if (set.contains(e.getTestcaseName())) {
                continue;
            }
            set.add(e.getTestcaseName());
            result.add(e);
        }
        return result;
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
