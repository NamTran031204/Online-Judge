package com.example.main_service.contest.controller;

import com.example.main_service.contest.dto.CommonResponse;
import com.example.main_service.contest.dto.PageRequestDto;
import com.example.main_service.contest.dto.PageResult;
import com.example.main_service.contest.dto.contest.*;
import com.example.main_service.contest.model.ContestEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contest")
public class ContestController {

    // crud
    @PostMapping("")
    public CommonResponse<ContestCreateUpdateResponseDto> create(@RequestBody ContestCreateUpdateRequestDto input) {
        return CommonResponse.success();
    }

    @PostMapping("/{contestId}/edit")
    public CommonResponse<ContestCreateUpdateResponseDto> update(
            @PathVariable Long contestId,
            @RequestBody ContestCreateUpdateRequestDto input) {
        return CommonResponse.success();
    }

    @PostMapping("/search")
    public CommonResponse<PageResult<ContestSummaryDto>> getPages(@RequestBody PageRequestDto<ContestFilterDto> input) {
        return CommonResponse.success();
    }

    @GetMapping("/{contestId}")
    public CommonResponse<ContestDetailDto> getById(@PathVariable Long contestId) {
        return CommonResponse.success();
    }

    @DeleteMapping("/{contestId}")
    public CommonResponse<String> delete(@PathVariable Long contestId) {
        return CommonResponse.success();
    }

}
