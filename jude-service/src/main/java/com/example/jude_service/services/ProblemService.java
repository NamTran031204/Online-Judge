package com.example.jude_service.services;

import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.entities.problem.ProblemEntity;
import com.example.jude_service.entities.problem.ProblemInputDto;
import com.example.jude_service.entities.problem.ProblemResponse;

public interface ProblemService {
    CommonResponse<ProblemEntity> addProblem(ProblemInputDto input);
}
