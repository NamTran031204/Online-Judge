package com.example.main_service.submission;

import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.submission.dto.SubmissionEntity;
import com.example.main_service.submission.dto.SubmissionInputDto;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

// submit thì bắn event vào 1 kafka topic (SUBMISSION_QUEUE) // nhét vào db trước + trả response
// fe tự poll và update bằng api get submission
// maybe làm thêm cơ chế ưu tiên contest đang running ? (maybe kafka priority queue)
// thiếu input và memory trong test case result
@RestController
@RequestMapping("${api.prefix}/submission")
@RequiredArgsConstructor
@Validated
public class SubmissionApiResource {

    private final SubmissionGrpcClient submissionGrpcClient;

    @PostMapping("/submit")
    public CommonResponse<SubmissionEntity> submit(@RequestBody SubmissionInputDto input) {
        return submissionGrpcClient.submit(input);
    }

    @PostMapping("/search")
    public CommonResponse<PageResult<SubmissionEntity>> getPage(PageRequestDto<SubmissionInputDto> pageRequest) {
        return submissionGrpcClient.getPage(pageRequest);
    }

    @GetMapping("/{submissionId}")
    public CommonResponse<SubmissionEntity> getById(@PathVariable("submissionId") String submissionId) {
        return submissionGrpcClient.getById(submissionId);
    }

//    @DeleteMapping("/{submissionId}")
//    public CommonResponse<SubmissionEntity> deleteById(@PathVariable("submissionId") String submissionId) {
//        return submissionGrpcClient.deleteById(submissionId);
//    }

//    @DeleteMapping("/by-problem/{problemId}")
//    public CommonResponse<SubmissionEntity> deleteByProblem(@PathVariable("problemId") String problemId) {
//        return submissionGrpcClient.deleteByProblem(problemId);
//    }

//    @DeleteMapping("/by-user/{userId}")
//    public CommonResponse<SubmissionEntity> deleteByUser(@PathVariable("userId") Long userId) {
//        return submissionGrpcClient.deleteByUser(userId);
//    }
}
