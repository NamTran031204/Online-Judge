package com.example.jude_service.api;

import com.example.jude_service.entities.PageRequestDto;
import com.example.jude_service.entities.problem.ProblemEntity;
import com.example.jude_service.entities.problem.ProblemInputDto;
import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.entities.PageResult;
import com.example.jude_service.services.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/problem")
@RequiredArgsConstructor
@Validated
public class ProblemApiResource {

    private final ProblemService problemService;

    @PostMapping(value = "/add-problem")
    public CommonResponse<ProblemEntity> addProblem(@RequestBody ProblemInputDto input) {
        return problemService.addProblem(input);
    }

    @PostMapping(value = "/get-page")
    public PageResult<CommonResponse<ProblemEntity>> getProblemPage(@RequestBody PageRequestDto input) {
        return problemService.getProblemPage(input);
    }

    @GetMapping(value = "/get-by-id/{problemId}")
    public CommonResponse<ProblemEntity> getProblemById(@PathVariable("problemId") String problemId) {
        return problemService.getProblemById(problemId);
    }

    @PostMapping(value = "/update/{problemId}")
    public CommonResponse<ProblemEntity> updateProblem(@RequestBody ProblemInputDto input, @PathVariable("problemId") String problemId) {
        return problemService.updateProblem(input, problemId);
    }

    @DeleteMapping(value = "/delete/{problemId}")
    public CommonResponse<ProblemEntity> deleteProblem(@PathVariable("problemId") String problemId) {
        return problemService.deleteProblem(problemId);
    }


}
