package com.example.jude_service.services;

import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.entities.PageRequestDto;
import com.example.jude_service.entities.PageResult;
import com.example.jude_service.entities.submission.SubmissionEntity;
import com.example.jude_service.entities.submission.SubmissionInputDto;
import org.springframework.web.bind.annotation.*;

public interface SubmissionService {
    CommonResponse<SubmissionEntity> submit(@RequestBody SubmissionInputDto input);
    CommonResponse<PageResult<SubmissionEntity>> getPage(PageRequestDto<SubmissionInputDto> pageRequest);
    CommonResponse<SubmissionEntity> getById(@PathVariable("submissionId") String submissionId);
    CommonResponse<SubmissionEntity> deleteById(@PathVariable("submissionId") String submissionId);
    CommonResponse<SubmissionEntity> deleteByProblem(@PathVariable("problemId") String problemId);
    CommonResponse<SubmissionEntity> deleteByUser(@PathVariable("userId") String userId);
}
