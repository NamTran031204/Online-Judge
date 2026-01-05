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

    @PostMapping("")
    public CommonResponse<SubmissionEntity> submit(@RequestBody SubmissionInputDto input) {
        return submissionService.submit(input);
    }

    @PostMapping("/search")
    public CommonResponse<PageResult<SubmissionEntity>> getPage(PageRequestDto<SubmissionInputDto> pageRequest) {
        return submissionService.getPage(pageRequest);
    }

    @GetMapping("/{submissionId}")
    public CommonResponse<SubmissionEntity> getById(@PathVariable("submissionId") String submissionId) {
        return submissionService.getById(submissionId);
    }

    @DeleteMapping("/{submissionId}")
    public CommonResponse<SubmissionEntity> deleteById(@PathVariable("submissionId") String submissionId) {
        return submissionService.deleteById(submissionId);
    }

    @DeleteMapping("/by-problem/{problemId}")
    public CommonResponse<SubmissionEntity> deleteByProblem(@PathVariable("problemId") String problemId) {
        return submissionService.deleteByProblem(problemId);
    }

    @DeleteMapping("/by-user/{userId}")
    public CommonResponse<SubmissionEntity> deleteByUser(@PathVariable("userId") Long userId) {
        return submissionService.deleteByUser(userId);
    }
}
