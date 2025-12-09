package com.example.main_service.problem;

import com.example.main_service.problem.dto.ProblemEntity;
import com.example.main_service.problem.dto.ProblemInputDto;
import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/problem")
@RequiredArgsConstructor
@Validated
public class ProblemApiResource {

    private final ProblemGrpcClient problemGrpcClient;

    @PostMapping(value = "")
    public CommonResponse<ProblemEntity> addProblem(@RequestBody ProblemInputDto input) {
        return problemGrpcClient.addProblem(input);
    }

    @PostMapping(value = "/search")
    public CommonResponse<PageResult<ProblemEntity>> getProblemPage(@RequestBody PageRequestDto<ProblemInputDto> input) {
        return problemGrpcClient.getProblemPage(input);
    }

    @GetMapping(value = "/{problemId}")
    public CommonResponse<ProblemEntity> getProblemById(@PathVariable("problemId") String problemId) {
        return problemGrpcClient.getProblemById(problemId);
    }

    @PostMapping(value = "/{problemId}/edit")
    public CommonResponse<ProblemEntity> updateProblem(@RequestBody ProblemInputDto input, @PathVariable("problemId") String problemId) {
        return problemGrpcClient.updateProblem(input, problemId);
    }

    @PostMapping(value = "/by-contest")
    public CommonResponse<PageResult<ProblemEntity>> getProblemByContest(PageRequestDto<Long> input) {
        return problemGrpcClient.getByContest(input);
    }

    @PostMapping(value = "/search-text")
    public CommonResponse<PageResult<ProblemEntity>> searchProblem(@RequestBody PageRequestDto<String> input) {
        return problemGrpcClient.searching(input);
    }

    @DeleteMapping(value = "/{problemId}")
    public CommonResponse<ProblemEntity> deleteProblem(@PathVariable("problemId") String problemId) {
        return problemGrpcClient.deleteProblem(problemId);
    }

}
