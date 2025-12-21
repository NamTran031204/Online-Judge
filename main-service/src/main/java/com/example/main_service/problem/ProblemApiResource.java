package com.example.main_service.problem;

import com.example.main_service.problem.dto.ProblemEntity;
import com.example.main_service.problem.dto.ProblemInputDto;
import com.example.main_service.rbac.RbacService;
import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static com.example.main_service.rbac.RbacService.getUserIdFromToken;

// cần handle exception ngay lập tức
@RestController
@RequestMapping("${api.prefix}/problem")
@RequiredArgsConstructor
@Validated
@Slf4j
public class ProblemApiResource {

    private final ProblemGrpcClient problemGrpcClient;
    private final RbacService rbacService;

    @PostMapping(value = "/add-problem")
    public CommonResponse<ProblemEntity> addProblem(@RequestBody ProblemInputDto input) {
        Long userId = getUserIdFromToken();
        if (userId == 0L) {
            throw new IllegalStateException("User not authenticated");
        }
        input.setUserId(userId);
        log.info("============={}",input);

        CommonResponse<ProblemEntity> response =  problemGrpcClient.addProblem(input);

        ProblemEntity problem = response.getData();
        if (problem == null) {
            throw new IllegalStateException("GRPC returned null ProblemEntity");
        }

        String problemId = problem.getProblemId(); 
        if (problemId == null) {
            throw new IllegalStateException("ProblemId is null");
        }

        rbacService.assignRole(
                userId,
                "Author",
                "Problem",
                problemId
        );
        return response;
    }

    // bug
    // search theo filter nhung loc nhung cai draft theo role user
    @PostMapping(value = "/search")
    public CommonResponse<PageResult<ProblemEntity>> getProblemPage(@RequestBody PageRequestDto<ProblemInputDto> input) {
        log.info("====== INPUT: {}", input);

        return problemGrpcClient.getProblemPage(input);
    }

    @GetMapping(value = "/get-by-id/{problemId}")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'problem:view', 'Problem', #problemId)")
    public CommonResponse<ProblemEntity> getProblemById(@PathVariable("problemId") String problemId) {
        return problemGrpcClient.getProblemById(problemId);
    }

    @PostMapping(value = "/update/{problemId}")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'problem:edit', 'Problem', #problemId)")
    public CommonResponse<ProblemEntity> updateProblem(@RequestBody ProblemInputDto input, @PathVariable("problemId") String problemId) {
        Long userId = getUserIdFromToken();
        input.setUserId(userId);
        return problemGrpcClient.updateProblem(input, problemId);
    }

    /*
    // tạm coi là official contest // skip vi deo can
    @PostMapping(value = "/by-contest")
    public CommonResponse<PageResult<ProblemEntity>> getProblemByContest(PageRequestDto<Long> input) {
        return problemGrpcClient.getByContest(input);
    }
    */

    // search problem trong bảng problem contest (đã kết thúc, public)
    @PostMapping(value = "/search-text")
    public CommonResponse<PageResult<ProblemEntity>> searchProblem(@RequestBody PageRequestDto<String> input) {
        return problemGrpcClient.searching(input);
    }

    // bug
    @DeleteMapping(value = "/delete/{problemId}")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'problem:delete', 'Problem', #problemId)")
    public CommonResponse<ProblemEntity> deleteProblem(@PathVariable("problemId") String problemId) {
        return problemGrpcClient.deleteProblem(problemId);
    }

}
