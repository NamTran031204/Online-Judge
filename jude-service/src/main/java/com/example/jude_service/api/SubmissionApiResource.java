package com.example.jude_service.api;

import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.entities.PageRequestDto;
import com.example.jude_service.entities.PageResult;
import com.example.jude_service.entities.problem.ProblemInputDto;
import com.example.jude_service.entities.submission.SubmissionEntity;
import com.example.jude_service.entities.submission.SubmissionInputDto;
import com.example.jude_service.services.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/submission")
@RequiredArgsConstructor
@Validated
public class SubmissionApiResource {

    private final SubmissionService submissionService;

    @PostMapping("/submit")
    public CommonResponse<SubmissionEntity> submit(@RequestBody SubmissionInputDto input) {
        return submissionService.submit(input);
    }

    @PostMapping("/get-page")
    public CommonResponse<PageResult<SubmissionEntity>> getPage(PageRequestDto<SubmissionInputDto> pageRequest) {
        return submissionService.getPage(pageRequest);
    }

    @GetMapping("/get-by-id/{submissionId}")
    public CommonResponse<SubmissionEntity> getById(@PathVariable("submissionId") String submissionId) {
        return submissionService.getById(submissionId);
    }

    @DeleteMapping("/delete-by-id/{submissionId}")
    public CommonResponse<SubmissionEntity> deleteById(@PathVariable("submissionId") String submissionId) {
        return submissionService.deleteById(submissionId);
    }

    @DeleteMapping("/delete-by-problem/{problemId}")
    public CommonResponse<SubmissionEntity> deleteByProblem(@PathVariable("problemId") String problemId) {
        return submissionService.deleteByProblem(problemId);
    }

    @DeleteMapping("/delete-by-user/{userId}")
    public CommonResponse<SubmissionEntity> deleteByUser(@PathVariable("userId") String userId) {
        return submissionService.deleteByUser(userId);
    }
}
