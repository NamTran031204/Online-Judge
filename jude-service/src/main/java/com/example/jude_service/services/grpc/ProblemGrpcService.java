package com.example.jude_service.services.grpc;

import com.example.jude_service.entities.problem.ProblemEntity;
import com.example.jude_service.exceptions.ErrorCode;
import com.example.jude_service.exceptions.specException.ProblemBusinessException;
import com.example.jude_service.repo.ProblemRepo;
import com.example.proto.ProblemServiceGrpc;
import com.example.proto.ValidateAndCloneProblemRequest;
import com.example.proto.ValidateAndCloneProblemResponse;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class ProblemGrpcService extends ProblemServiceGrpc.ProblemServiceImplBase {

    private final ProblemRepo problemRepo;

    @Override
    public void validateAndCloneProblem(
            ValidateAndCloneProblemRequest request,
            StreamObserver<ValidateAndCloneProblemResponse> responseObserver
    ) {
        try {
            ProblemEntity problem = problemRepo.findById(request.getProblemId())
                    .orElseThrow(() -> new ProblemBusinessException(ErrorCode.PROBLEM_NOT_FOUND));

            ProblemEntity cloneProblem = problemRepo.save(ProblemEntity.builder()
                    .title(problem.getTitle())
                    .description(problem.getDescription())
                    .tags(problem.getTags())
                    .imageUrls(problem.getImageUrls())
                    .level(problem.getLevel())
                    .supportedLanguage(problem.getSupportedLanguage())
                    .solution(problem.getSolution())
                    .rating(problem.getRating())
                    .score(problem.getScore())
                    .timeLimit(problem.getTimeLimit())
                    .memoryLimit(problem.getMemoryLimit())
                    .inputType(problem.getInputType())
                    .outputType(problem.getOutputType())
                    .authorId(request.getUserId())
                    .testcaseEntities(problem.getTestcaseEntities())
                    .createdBy(request.getUserId())
                    .lastModifiedBy(request.getUserId())
                            .contestId(request.getContestId())
                    .build());

            var response = ValidateAndCloneProblemResponse.newBuilder()
                    .setSuccess(true)
                    .setErrorCode(ErrorCode.SUCCESS.getCode())
                    .setNewProblemId(cloneProblem.getProblemId())
                    .setMessage(ErrorCode.SUCCESS.getMessage())
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (ProblemBusinessException e) {
            responseObserver.onError(e);
        }
    }

}
