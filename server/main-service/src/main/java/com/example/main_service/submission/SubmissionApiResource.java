package com.example.main_service.submission;

import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.submission.dto.SubmissionEntity;
import com.example.main_service.submission.dto.SubmissionInputDto;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static com.example.main_service.rbac.RbacService.getUserIdFromToken;

@RestController
@RequestMapping("${api.prefix}/submission")
@RequiredArgsConstructor
@Validated
public class SubmissionApiResource {

    private final SubmissionService submissionService;

    @PostMapping("/submit")
    public CommonResponse<SubmissionEntity> submit(@RequestBody SubmissionInputDto input) {
        SubmissionEntity submission = submissionService.submit(getUserIdFromToken(), input);
        return CommonResponse.success(submission);
    }

    @PostMapping("/search")
    public CommonResponse<PageResult<SubmissionEntity>> getPage(@RequestBody PageRequestDto<SubmissionInputDto> pageRequest) {
        PageResult<SubmissionEntity> page = submissionService.getPage(getUserIdFromToken(), pageRequest);
        return CommonResponse.success(page);
    }

    @GetMapping("/{submissionId}")
    public CommonResponse<SubmissionEntity> getById(@PathVariable String submissionId) {
        SubmissionEntity submission = submissionService.getById(getUserIdFromToken(), submissionId);
        return CommonResponse.success(submission);
    }
}
