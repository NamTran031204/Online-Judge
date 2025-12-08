package com.example.jude_service.services.impl;

import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.entities.PageRequestDto;
import com.example.jude_service.entities.PageResult;
import com.example.jude_service.entities.problem.ProblemEntity;
import com.example.jude_service.entities.problem.ProblemInputDto;
import com.example.jude_service.entities.testcase.TestcaseEntity;
import com.example.jude_service.enums.LanguageType;
import com.example.jude_service.exceptions.ErrorCode;
import com.example.jude_service.exceptions.specException.ProblemBusinessException;
import com.example.jude_service.repo.ProblemRepo;
import com.example.jude_service.repo.SubmissionRepo;
import com.example.jude_service.services.ProblemService;
import com.example.jude_service.services.SubmissionService;
import com.example.jude_service.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepo problemRepo;
    private final MongoTemplate mongoTemplate;
    private final SubmissionService submissionService;

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
                .contestId(input.getContestId())
                .build());
        return CommonResponse.success(entity);
    }

    @Override
    public CommonResponse<PageResult<ProblemEntity>> getProblemPage(PageRequestDto<ProblemInputDto> input) {
        Query query = new Query();
        if (input.getFilter() != null) {
            query = filter(input);
        }
        PageResult<ProblemEntity> result = queryByFilter(query, input.getPageRequest());
        return CommonResponse.success(result);
    }

    @Override
    public CommonResponse<ProblemEntity> getProblemById(String problemId) {
         ProblemEntity entity = problemRepo.findById(problemId.toString())
                .orElseThrow(() -> new ProblemBusinessException(ErrorCode.PROBLEM_NOT_FOUND));
         return CommonResponse.success(entity);
    }

    @Override
    public CommonResponse<PageResult<ProblemEntity>> getByContest(PageRequestDto<Long> input) {
        Long contestId = input.getFilter();

        Query query = new Query();
        query.addCriteria(
                Criteria.where("contestId").is(contestId)
        );

        PageResult<ProblemEntity> result = queryByFilter(query, input.getPageRequest());

        return CommonResponse.success(result);
    }

    @Override
    public CommonResponse<PageResult<ProblemEntity>> searching(PageRequestDto<String> input) {
        String searchTerm = input.getFilter();

        /**
         * TODO: lam tim kiem that chinh xac
         */
        Query query = new Query();
        query.addCriteria(
                new Criteria().orOperator(
                        Criteria.where("title").regex(searchTerm),
                        Criteria.where("description").regex(searchTerm)
                )
        );

        PageResult<ProblemEntity> result = queryByFilter(query, input.getPageRequest());
        return CommonResponse.success(result);
    }

    @Override
    public CommonResponse<ProblemEntity> updateProblem(ProblemInputDto input, String problemId) {
        ProblemEntity entity = problemRepo.findById(problemId.toString())
                .orElseThrow(() -> new ProblemBusinessException(ErrorCode.PROBLEM_NOT_FOUND));

        /**
         * TODO: check lại yêu cầu từ FE, xem nếu một trường được cập nhat là xoá hêts gia tri trong do thi la khong gui truong do hay la gui truong rong, vi du isEmpty
         */

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
        if (input.getUserId() != null) {
            if (!input.getUserId().equals(entity.getAuthorId())){
                throw new ProblemBusinessException(ErrorCode.UNAUTHORIZED, "ban khong co quyen sua");
            }
            entity.setLastModifiedBy(input.getUserId());
        }

        problemRepo.save(entity);
        return CommonResponse.success(entity);
    }

    @Override
    public CommonResponse<ProblemEntity> deleteProblem(String problemId) {
        ProblemEntity problem = problemRepo.findById(problemId)
                .orElseThrow(() -> new ProblemBusinessException(ErrorCode.PROBLEM_NOT_FOUND));
        submissionService.deleteById(problemId);
        problemRepo.delete(problem);
        return CommonResponse.success(problem);
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

    Query filter(PageRequestDto<ProblemInputDto> input) {
        Query query = new Query();
        ProblemInputDto term = input.getFilter();

        if (!term.getTags().isEmpty()) {
            query.addCriteria(
                    Criteria.where("tags").in(term.getTags())
            );
        }
        if (term.getLevel() != null) {
            query.addCriteria(
                    Criteria.where("level").is(term.getLevel())
            );
        }

        // can xem xet them, vi dang ra yeu cau chi la mot loai thoi
        if (term.getSupportedLanguage() != null) {
            LanguageType language = term.getSupportedLanguage().getFirst();
            query.addCriteria(
                    Criteria.where("supportedLanguage").is(language)
            );
        }

        if (!StringUtils.isNullOrEmpty(term.getRating())) {
            query.addCriteria(
                    Criteria.where("rating").is(term.getRating())
            );
        }

        if (term.getScore() != null) {
            query.addCriteria(
                    Criteria.where("score").is(term.getScore())
            );
        }

        return query;
    }

    PageResult<ProblemEntity> queryByFilter(Query query, PageRequest input) {
        long count = mongoTemplate.count(query, ProblemEntity.class);

        query.with(input);

        List<ProblemEntity> entities = mongoTemplate.find(query, ProblemEntity.class);

        PageResult<ProblemEntity> pageResult = new PageResult<>();
        pageResult.setTotalCount(count);
        pageResult.setData(entities);
        return pageResult;
    }


}
