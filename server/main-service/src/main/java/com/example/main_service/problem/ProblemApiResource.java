package com.example.main_service.problem;

import com.example.main_service.problem.dto.ProblemEntity;
import com.example.main_service.problem.dto.ProblemInputDto;
import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static com.example.main_service.rbac.RbacService.getUserIdFromToken;

@RestController
@RequestMapping("${api.prefix}/problem")
@RequiredArgsConstructor
@Validated
@Slf4j
public class ProblemApiResource {

    private final ProblemService problemService;

    @PostMapping("/add-problem")
    public CommonResponse<ProblemEntity> addProblem(@RequestBody ProblemInputDto input) {
        ProblemEntity problem = problemService.addProblem(getUserIdFromToken(), input);
        return CommonResponse.success(problem);
    }

    @PostMapping("/search")
    public CommonResponse<PageResult<ProblemEntity>> getProblemPage(@RequestBody PageRequestDto<ProblemInputDto> input) {
        PageResult<ProblemEntity> page = problemService.getProblemPage(getUserIdFromToken(), input);
        return CommonResponse.success(page);
    }

    @GetMapping("/get-by-id/{problemId}")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'problem:view', 'PROBLEM', #problemId)")
    public CommonResponse<ProblemEntity> getProblemById(@PathVariable String problemId) {
        ProblemEntity problem = problemService.getProblemById(getUserIdFromToken(), problemId);
        return CommonResponse.success(problem);
    }

    @PostMapping("/update/{problemId}")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'problem:edit', 'PROBLEM', #problemId)")
    public CommonResponse<ProblemEntity> updateProblem(
            @RequestBody ProblemInputDto input,
            @PathVariable String problemId
    ) {
        Long userId = getUserIdFromToken();
        input.setUserId(userId);

        ProblemEntity updated = problemService.updateProblem(userId, problemId, input);
        return CommonResponse.success(updated);
    }

    @PostMapping("/search-text")
    public CommonResponse<PageResult<ProblemEntity>> searchProblem(@RequestBody PageRequestDto<String> input) {
        PageResult<ProblemEntity> page = problemService.searching(getUserIdFromToken(), input);
        return CommonResponse.success(page);
    }

    @DeleteMapping("/delete/{problemId}")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'problem:delete', 'PROBLEM', #problemId)")
    public CommonResponse<ProblemEntity> deleteProblem(@PathVariable String problemId) {
        ProblemEntity deleted = problemService.deleteProblem(getUserIdFromToken(), problemId);
        return CommonResponse.success(deleted);
    }
}
