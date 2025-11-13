package com.example.jude_service.services.impl;

import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.entities.PageRequestDto;
import com.example.jude_service.entities.PageResult;
import com.example.jude_service.entities.submission.SubmissionEntity;
import com.example.jude_service.entities.submission.SubmissionInputDto;
import com.example.jude_service.exceptions.ErrorCode;
import com.example.jude_service.exceptions.specException.ProblemBusinessException;
import com.example.jude_service.exceptions.specException.SubmissionBusinessException;
import com.example.jude_service.repo.ProblemRepo;
import com.example.jude_service.repo.SubmissionRepo;
import com.example.jude_service.services.SubmissionService;
import com.example.jude_service.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {
    private final SubmissionRepo submissionRepo;
    private final ProblemRepo problemRepo;
    private final MongoTemplate mongoTemplate;

    @Override
    public CommonResponse<SubmissionEntity> submit(SubmissionInputDto input) {

        if (StringUtils.isNullOrEmpty(input.getProblemId())) {
            throw new SubmissionBusinessException(ErrorCode.SUBMISSION_INVALID, "problem id is empty");
        } else {
            if (!problemRepo.existsById(input.getProblemId())) {
                throw new ProblemBusinessException(ErrorCode.PROBLEM_NOT_FOUND);
            }
        }

        if (StringUtils.isNullOrEmpty(input.getUserId())) {
            throw new SubmissionBusinessException(ErrorCode.FORBIDDEN, "user id is empty");
        }

        switch (input.getLanguage()) {
            case CPP -> submit();
            case JAVA -> submit();
            case PYTHON -> submit();
            default -> submit();
        }

        return null;
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
    public CommonResponse<SubmissionEntity> deleteByUser(String userId) {

        /**
         * TODO: Validate userId co ton tai
         */
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

        if (StringUtils.isNullOrEmpty(request.getUserId())) {
            query.addCriteria(
                    Criteria.where("userId").is(request.getUserId())
            );
        }

        if (StringUtils.isNullOrEmpty(request.getContestId())) {
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
