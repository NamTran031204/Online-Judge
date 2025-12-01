package com.example.main_service.contest.controller;

import com.example.main_service.contest.dto.CommonResponse;
import com.example.main_service.contest.dto.PageRequestDto;
import com.example.main_service.contest.dto.PageResult;
import com.example.main_service.contest.dto.contest.*;
import com.example.main_service.contest.model.ContestEntity;
import com.example.main_service.contest.service.ContestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contest")
@RequiredArgsConstructor
public class ContestController {
    private final ContestService contestService;

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

}
