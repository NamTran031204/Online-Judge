package com.example.jude_service.services.impl;

import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.entities.PageRequestDto;
import com.example.jude_service.entities.PageResult;
import com.example.jude_service.entities.judge.JudgeResult;
import com.example.jude_service.entities.judge.TestCaseResult;
import com.example.jude_service.entities.submission.SubmissionEntity;
import com.example.jude_service.entities.submission.SubmissionInputDto;
import com.example.jude_service.entities.submission.SubmissionResultEntity;
import com.example.jude_service.exceptions.ErrorCode;
import com.example.jude_service.exceptions.specException.ProblemBusinessException;
import com.example.jude_service.exceptions.specException.SubmissionBusinessException;
import com.example.jude_service.repo.ProblemRepo;
import com.example.jude_service.repo.SubmissionRepo;
import com.example.jude_service.services.JudgeService;
import com.example.jude_service.services.SubmissionService;
import com.example.jude_service.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {
    private final SubmissionRepo submissionRepo;
    private final ProblemRepo problemRepo;
    private final MongoTemplate mongoTemplate;
    private final JudgeService judgeService;

    @Override
    @Transactional(rollbackFor = {SubmissionBusinessException.class, ProblemBusinessException.class, IOException.class})
    public CommonResponse<SubmissionEntity> submit(SubmissionInputDto input) {

        if (StringUtils.isNullOrEmpty(input.getProblemId())) {
            throw new SubmissionBusinessException(ErrorCode.SUBMISSION_INVALID, "problem id is empty");
        } else {
            if (!problemRepo.existsById(input.getProblemId())) {
                throw new ProblemBusinessException(ErrorCode.PROBLEM_NOT_FOUND);
            }
        }

        // TODO: check lai submission đuơcj validate trước khi đi vào srvice nay khong, neu khong thi validate quyen
        if (input.getUserId() == null) {
            throw new SubmissionBusinessException(ErrorCode.FORBIDDEN, "user id is empty");
        }

        try {
            JudgeResult judgeResult = judgeService.judge(input, input.getProblemId());
            List<SubmissionResultEntity> results = judgeResult.getTestCaseResults().stream()
                    .map(this::convertToSubmissionResult)
                    .collect(Collectors.toList());

            SubmissionEntity entity = SubmissionEntity.builder()
                    .problemId(input.getProblemId())
                    .contestId(input.getContestId())
                    .userId(input.getUserId())
                    .sourceCode(input.getSourceCode())
                    .language(input.getLanguage())
                    .result(results)
                    .build();

            SubmissionEntity savedEntity = submissionRepo.save(entity);
            return CommonResponse.success(savedEntity,
                    String.format("Submission judged: %s (%d/%d passed)",
                            judgeResult.getFinalVerdict(),
                            judgeResult.getPassedTestCases(),
                            judgeResult.getTotalTestCases()));
        } catch (Exception e) {
            throw new SubmissionBusinessException(
                    ErrorCode.INTERNAL_SERVER_ERROR,
                    "Failed to judge submission: " + e.getMessage()
            );
        }
    }

    private SubmissionResultEntity convertToSubmissionResult(TestCaseResult testCaseResult) {
        return SubmissionResultEntity.builder()
                .testcaseName(testCaseResult.getTestCaseId())
                .input(null) // Không lưu input trong result
                .output(testCaseResult.getActualOutput())
                .status(testCaseResult.getVerdict())
                .time(testCaseResult.getExecutionTime() != null
                        ? testCaseResult.getExecutionTime().floatValue()
                        : 0f)
                .memory(testCaseResult.getMemoryUsed() != null
                        ? testCaseResult.getMemoryUsed().floatValue()
                        : 0f)
                .build();
    }

    @Override
    public CommonResponse<PageResult<SubmissionEntity>> getPage(PageRequestDto<SubmissionInputDto> pageRequest) {
        Query query = filter(pageRequest);

        long count = mongoTemplate.count(query, SubmissionEntity.class);

        query.with(pageRequest.getPageRequest());

        List<SubmissionEntity> entities = mongoTemplate.find(query, SubmissionEntity.class);

        PageResult<SubmissionEntity> pageResult = new PageResult<>();
        pageResult.setTotalCount(count);
        pageResult.setData(entities);
        return CommonResponse.success(pageResult);
    }

    @Override
    public CommonResponse<SubmissionEntity> getById(String submissionId) {
        SubmissionEntity result = submissionRepo.findById(submissionId)
                .orElseThrow(() -> new SubmissionBusinessException(ErrorCode.SUBMISSION_NOT_FOUND));
        return CommonResponse.success(result);
    }

    @Override
    public CommonResponse<SubmissionEntity> deleteById(String submissionId) {
        if (!submissionRepo.existsById(submissionId)) {
            throw new SubmissionBusinessException(ErrorCode.SUBMISSION_NOT_FOUND);
        }
        submissionRepo.deleteById(submissionId);
        return CommonResponse.success();
    }

    @Override
    public CommonResponse<SubmissionEntity> deleteByProblem(String problemId) {
        if (problemRepo.existsById(problemId)) {
            submissionRepo.deleteByProblemId(problemId);
            return CommonResponse.success();
        }
        return CommonResponse.fail(ErrorCode.PROBLEM_NOT_FOUND);
    }

    @Override
    public CommonResponse<SubmissionEntity> deleteByUser(Long userId) {
        submissionRepo.deleteByUserId(userId);
        return CommonResponse.success();
    }

    private static void submit() {

    }

    private Query filter(PageRequestDto<SubmissionInputDto> pageRequest) {
        Query query = new Query();
        SubmissionInputDto request = pageRequest.getFilter();

        if (StringUtils.isNullOrEmpty(request.getProblemId())) {
            query.addCriteria(
                    Criteria.where("problemId").is(request.getProblemId())
            );
        }

        if (request.getUserId() != null) {
            query.addCriteria(
                    Criteria.where("userId").is(request.getUserId())
            );
        }

        if (request.getContestId() != null) {
            query.addCriteria(
                    Criteria.where("contestId").is(request.getContestId())
            );
        }

        if (request.getLanguage() != null) {
            query.addCriteria(Criteria.where("language").is(request.getLanguage()));
        }

        return query;
    }
}
