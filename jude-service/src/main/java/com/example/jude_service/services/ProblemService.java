package com.example.jude_service.services;

import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.entities.PageRequestDto;
import com.example.jude_service.entities.PageResult;
import com.example.jude_service.entities.problem.ProblemEntity;
import com.example.jude_service.entities.problem.ProblemInputDto;
import com.example.jude_service.entities.problem.ProblemResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

public interface ProblemService {
    CommonResponse<ProblemEntity> addProblem(ProblemInputDto input);
    PageResult<CommonResponse<ProblemEntity>> getProblemPage(PageRequestDto input);
    CommonResponse<ProblemEntity> getProblemById(String problemId);
    CommonResponse<ProblemEntity> updateProblem(ProblemInputDto input, String problemId);
    CommonResponse<ProblemEntity> deleteProblem(String problemId);
}
