package com.example.main_service.contest.controller;

import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.contest.dto.contest.*;
import com.example.main_service.contest.model.ContestEntity;
import com.example.main_service.contest.dto.contestProblem.ContestProblemResponseDto;
import com.example.main_service.contest.service.ContestProblemService;
import com.example.main_service.contest.service.ContestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

// rbac dat trong application yml
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
    @PreAuthorize("@rbacService.hasPermission(authentication, 'contest:edit', 'Contest', #contestId)")
    public CommonResponse<ContestCreateUpdateResponseDto> update(
            @PathVariable Long contestId,
            @RequestBody ContestCreateUpdateRequestDto input) {
        return CommonResponse.success(contestService.updateContest(contestId, input));
    }

    @PostMapping("/search")
    public CommonResponse<PageResult<ContestEntity>> getPages(@RequestBody PageRequestDto<ContestFilterDto> input) {
        return CommonResponse.success(contestService.search(input));
    }

    @GetMapping("/{contestId}") // cho tester
    @PreAuthorize("@rbacService.hasPermission(authentication, 'contest:view', 'Contest', #contestId)")
    public CommonResponse<ContestDetailDto> getById(@PathVariable Long contestId) {
        return CommonResponse.success(contestService.getById(contestId));
    }

    @DeleteMapping("/{contestId}")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'contest:edit', 'Contest', #contestId)")
    public CommonResponse<String> delete(@PathVariable Long contestId) {
        contestService.deleteContest(contestId);
        return CommonResponse.success("delete contest success");
    }

    // them problem
    @PostMapping("/{contestId}/problems")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'contest:edit', 'Contest', #contestId)")
    public CommonResponse<ContestProblemResponseDto> addProblem(
            @PathVariable Long contestId,
            @RequestBody ContestAttachProblemRequestDto input) {
        return CommonResponse.success(contestProblemService.addProblemToContest(contestId, input));
    }

    // xoa problem
    @DeleteMapping("/{contestId}/problem/{problemId}")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'contest:edit', 'Contest', #contestId)")
    public CommonResponse<String> deleteProblem(@PathVariable Long contestId, @PathVariable String problemId) {
        contestProblemService.deleteProblemFromContest(contestId, problemId);
        return CommonResponse.success();
    }


    // tạm thời skip
    @PostMapping("{contestId}/promote-to-gym")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'contest:edit', 'Contest', #contestId)")
    public CommonResponse<PromoteDraftToGymResponseDto> promoteDraftToGym(
            @PathVariable("contestId") Long contestId,
            @RequestBody PromoteDraftToGymRequestDto input
    ) {
        return CommonResponse.success(contestService.promoteDraft(contestId, input));
    }

}
