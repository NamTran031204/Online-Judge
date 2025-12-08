package com.example.main_service.contest.service.impl;

import com.example.main_service.contest.dto.contest.ContestAttachProblemRequestDto;
import com.example.main_service.contest.dto.contestProblem.ContestProblemResponseDto;
import com.example.main_service.sharedAttribute.exceptions.ErrorCode;
import com.example.main_service.sharedAttribute.exceptions.specException.ContestBusinessException;
import com.example.main_service.contest.model.ContestProblemEntity;
import com.example.main_service.contest.repo.ContestProblemRepo;
import com.example.main_service.contest.repo.ContestRepo;
import com.example.main_service.contest.service.ContestProblemService;
import com.example.main_service.problem.ProblemGrpcClient;
import com.example.proto.ProblemServiceGrpc;
import com.example.proto.ValidateAndCloneProblemRequest;
import com.example.proto.ValidateAndCloneProblemResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContestProblemServiceImpl implements ContestProblemService {
    private final ContestRepo contestRepo;
    private final ContestProblemRepo contestProblemRepo;
    private final ProblemGrpcClient problemGrpcClient;

    @GrpcClient("jude-service")
    private ProblemServiceGrpc.ProblemServiceBlockingStub problemServiceStub;

    @Override
    @Transactional(rollbackOn = Exception.class)
    public ContestProblemResponseDto addProblemToContest(Long contestId, ContestAttachProblemRequestDto input) {

        if (!contestRepo.existsById(contestId)) {
            throw new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND);
        }

        String problemId = input.getProblemId();

        /**
         * @param: problemId, contestId
         * @response: 200 neu thanh cong, cac loi khac -> rollback
         * data tra
         */
        ValidateAndCloneProblemRequest grpcRequest = ValidateAndCloneProblemRequest.newBuilder()
                .setProblemId(problemId)
                .setContestId(contestId)
                .setUserId(0L)
                .build();
        ValidateAndCloneProblemResponse grpcResponse;
        try {
            grpcResponse = problemServiceStub.validateAndCloneProblem(grpcRequest);
        } catch (Exception e) {
            throw new ContestBusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
        if (!grpcResponse.getSuccess()){
            throw new ContestBusinessException(ErrorCode.CONTEST_PROBLEM_ERROR);
        }

        String newProblemId = grpcResponse.getNewProblemId();

        contestProblemRepo.save(ContestProblemEntity.builder()
                .contestId(contestId)
                .problemId(newProblemId)
                .build());

        ContestProblemResponseDto response = ContestProblemResponseDto.builder()
                .contestId(contestId)
                .problemId(newProblemId)
                .build();

        return response;
    }

    @Override
    public void deleteProblemFromContest(Long contestId, String problemId) {
        if (!contestRepo.existsById(contestId)) {
            throw new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND);
        }

        ContestProblemEntity entity = contestProblemRepo.findByContestIdAndProblemId(contestId, problemId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_PROBLEM_NOT_FOUND));

        var deleteResponse = problemGrpcClient.deleteProblem(problemId);
        if (!deleteResponse.getIsSuccessful()) {
            throw new ContestBusinessException(ErrorCode.PROBLEM_GRPC_ERROR, deleteResponse.getMessage());
        }

        contestProblemRepo.delete(entity);
    }
}
