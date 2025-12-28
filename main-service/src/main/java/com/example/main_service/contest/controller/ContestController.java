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

// visibility dùng cho mỗi gym
// các tk admin dat trong application yml (reasearch)
// cần refactor lại repo cho bảng nào thì nằm trong service đấy
// api submit to official (gan quyen xoa va edit cho admin,pro_user)
// contest official vẫn nên có thể được edit khi ở trạng thái upcoming
// api gán quyền read và edit cho 1 contest (role_user)

@RestController
@RequestMapping("${api.prefix}/contest")
@RequiredArgsConstructor
public class ContestController {
    private final ContestService contestService;
    private final ContestProblemService contestProblemService;

    @PostMapping("")
    public CommonResponse<ContestCreateUpdateResponseDto> create(@RequestBody ContestCreateUpdateRequestDto input) {
        // auto khi tạo thì contest là draft
        return CommonResponse.success(contestService.createContest(input));
    }

    @PostMapping("/{contestId}/edit")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'contest:edit',#contestId)")
    public CommonResponse<ContestCreateUpdateResponseDto> update(
            @PathVariable Long contestId,
            @RequestBody ContestCreateUpdateRequestDto input) {
        return CommonResponse.success(contestService.updateContest(contestId, input));
    }

    @PostMapping("/search")
    public CommonResponse<PageResult<ContestEntity>> getPages(@RequestBody PageRequestDto<ContestFilterDto> input) {
        // lọc contest official(check status) |gym(check status và visibility) và contest draft (check author)
        return CommonResponse.success(contestService.search(input));
    }

    @GetMapping("/{contestId}")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'contest:view', 'Contest', #contestId)")
    public CommonResponse<ContestDetailDto> getById(@PathVariable Long contestId) {
        // official (check status) | gym (check status và visibility | draft (check author)
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
    @PreAuthorize("@rbacService.canEditContest(authentication, 'contest:edit', #contestId,'DRAFT)")
    public CommonResponse<ContestProblemResponseDto> addProblem(
            @PathVariable Long contestId,
            @RequestBody ContestAttachProblemRequestDto input) {
        // official và gym (skip)
        return CommonResponse.success(contestProblemService.addProblemToContest(contestId, input));
    }

    // xoa problem
    @DeleteMapping("/{contestId}/problem/{problemId}")
    @PreAuthorize("@rbacService.canEditContest(authentication, 'contest:edit', #contestId,'DRAFT)")
    public CommonResponse<String> deleteProblem(@PathVariable Long contestId, @PathVariable String problemId) {
        // official và gym (skip)
        contestProblemService.deleteProblemFromContest(contestId, problemId);
        return CommonResponse.success();
    }

    // promote to gym
    @PostMapping("{contestId}/promote-to-gym")
    @PreAuthorize("@rbacService.canEditContest(authentication, 'contest:edit', #contestId,'DRAFT)")
    public CommonResponse<PromoteDraftToGymResponseDto> promoteDraftToGym(
            @PathVariable("contestId") Long contestId,
            @RequestBody PromoteDraftToGymRequestDto input
    ) {
        // official và gym (skip)
        return CommonResponse.success(contestService.promoteDraft(contestId, input));
    }

    @PostMapping("/{contest_id}/make-official") //Pro_user or admin
    @PreAuthorize("@rbacService.canMakeContestOffical(authentication, 'contest:make_official', 'Contest', #contestId)")
    public CommonResponse<String> promoteDrafttoOfficial (
           @PathVariable("contestId") Long contestId,
                   @RequestBody ContestMakeOfficialRequestDto request
    ) {
        contestService.promoteDraftToOfficial(contestId, request);
        return CommonResponse.success("ContestId promoted to OFFICIAL sucessfully");
    }

    @PostMapping("/{contestId}/assign-reviewer")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'contest:assign_reviewer', 'Contest', #contestId)")
    public CommonResponse<String> assignReviewer(
            @PathVariable Long contestId,
            @RequestBody AssignReviewerContestDto input
    ) {
        contestService.assignReviewer(contestId, input.getReviewerId());
        return CommonResponse.success("Reviewer assigned successfully");
    }

}
