package com.example.main_service.contest.controller;

import com.example.main_service.contest.dto.CommonResponse;
import com.example.main_service.contest.dto.PageRequestDto;
import com.example.main_service.contest.dto.PageResult;
import com.example.main_service.contest.dto.contest.*;
import com.example.main_service.contest.model.ContestEntity;
import com.example.main_service.contest.dto.contestProblem.ContestProblemResponseDto;
import com.example.main_service.contest.service.ContestProblemService;
import com.example.main_service.contest.service.ContestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/contest")
@RequiredArgsConstructor
public class ContestController {
    private final ContestService contestService;
    private final ContestProblemService contestProblemService;

    // crud
    @PostMapping("")
    public CommonResponse<ContestCreateUpdateResponseDto> create(@RequestBody ContestCreateUpdateRequestDto input) {
        return CommonResponse.success(contestService.createContest(input));
    }

    @PostMapping("/{contestId}/edit")
    public CommonResponse<ContestCreateUpdateResponseDto> update(
            @PathVariable Long contestId,
            @RequestBody ContestCreateUpdateRequestDto input) {
        return CommonResponse.success(contestService.updateContest(contestId, input));
    }

    /**
     * Get phan trang, ket hop tim kiem theo filter
     * @param input
     * @return
     */
    @PostMapping("/search")
    public CommonResponse<PageResult<ContestEntity>> getPages(@RequestBody PageRequestDto<ContestFilterDto> input) {
        return CommonResponse.success(contestService.search(input));
    }

    @GetMapping("/{contestId}")
    public CommonResponse<ContestDetailDto> getById(@PathVariable Long contestId) {
        return CommonResponse.success(contestService.getById(contestId));
    }

    @DeleteMapping("/{contestId}")
    public CommonResponse<String> delete(@PathVariable Long contestId) {
        contestService.deleteContest(contestId);
        return CommonResponse.success("delete contest success");
    }

    // them xoa problem
    @PostMapping("/{contestId}/problems")
    public CommonResponse<ContestProblemResponseDto> addProblem(
            @PathVariable Long contestId,
            @RequestBody ContestAttachProblemRequestDto input) {
        return CommonResponse.success(contestProblemService.addProblemToContest(contestId, input));
    }

    @DeleteMapping("/{contestId}/problem/{problemId}")
    public CommonResponse<String> deleteProblem(@PathVariable Long contestId, @PathVariable String problemId) {
        contestProblemService.deleteProblemFromContest(contestId, problemId);
        return CommonResponse.success();
    }

}
