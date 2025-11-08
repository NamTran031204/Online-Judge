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
        return null;
    }

    @GetMapping(value = "/get-by-id/{id}")
    public CommonResponse<ProblemEntity> getProblemById(@PathVariable("id") Long id) {
        return null;
    }

    @PostMapping(value = "/update")
    public CommonResponse<ProblemEntity> updateProblem(@RequestBody ProblemInputDto input) {
        return null;
    }

    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<String> deleteProblem(@PathVariable("id") Long id) {
        return null;
    }


}
