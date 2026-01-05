package com.example.jude_service.grpcService;

import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.entities.PageRequestDto;
import com.example.jude_service.entities.PageResult;
import com.example.jude_service.entities.submission.SubmissionEntity;
import com.example.jude_service.entities.submission.SubmissionInputDto;
import com.example.jude_service.entities.submission.SubmissionResultEntity;
import com.example.jude_service.enums.LanguageType;
import com.example.jude_service.exceptions.specException.ProblemBusinessException;
import com.example.jude_service.exceptions.specException.SubmissionBusinessException;
import com.example.jude_service.services.SubmissionService;
import com.example.proto.ProblemResponse;
import com.example.proto.submission.*;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

import java.util.stream.Collectors;

@GrpcService
@RequiredArgsConstructor
@Slf4j
public class SubmissionGrpcService extends SubmissionServiceGrpc.SubmissionServiceImplBase {

    private final SubmissionService submissionService;

    @Override
    public void submit(SubmitRequest request, StreamObserver<SubmissionResponse> responseObserver) {
        try {
            SubmissionInputDto inputDto = convertToInputDto(request.getInput());
            CommonResponse<SubmissionEntity> result = submissionService.submit(inputDto);
            SubmissionResponse response = convertToSubmissionResponse(result);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (ProblemBusinessException e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(Integer.parseInt(e.getErrorCode().getCode()))
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (SubmissionBusinessException e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(Integer.parseInt(e.getErrorCode().getCode()))
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(e.hashCode())
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    }

    @Override
    public void getSubmissionPage(GetSubmissionPageRequest request, StreamObserver<SubmissionPageResponse> responseObserver) {
        try {
            PageRequestDto<SubmissionInputDto> pageRequest = convertToPageRequestDto(request);
            CommonResponse<PageResult<SubmissionEntity>> result = submissionService.getPage(pageRequest);
            SubmissionPageResponse response = convertToSubmissionPageResponse(result);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (ProblemBusinessException e) {
            var response = SubmissionPageResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(Integer.parseInt(e.getErrorCode().getCode()))
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (SubmissionBusinessException e) {
            var response = SubmissionPageResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(Integer.parseInt(e.getErrorCode().getCode()))
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            var response = SubmissionPageResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(e.hashCode())
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    }

    @Override
    public void getSubmissionById(GetSubmissionByIdRequest request, StreamObserver<SubmissionResponse> responseObserver) {
        try {
            CommonResponse<SubmissionEntity> result = submissionService.getById(request.getSubmissionId());
            SubmissionResponse response = convertToSubmissionResponse(result);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (ProblemBusinessException e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(Integer.parseInt(e.getErrorCode().getCode()))
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (SubmissionBusinessException e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(Integer.parseInt(e.getErrorCode().getCode()))
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(e.hashCode())
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    }

    @Override
    public void deleteSubmissionById(DeleteSubmissionByIdRequest request, StreamObserver<SubmissionResponse> responseObserver) {
        try {
            CommonResponse<SubmissionEntity> result = submissionService.deleteById(request.getSubmissionId());
            SubmissionResponse response = convertToSubmissionResponse(result);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (ProblemBusinessException e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(Integer.parseInt(e.getErrorCode().getCode()))
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (SubmissionBusinessException e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(Integer.parseInt(e.getErrorCode().getCode()))
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(e.hashCode())
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    }

    @Override
    public void deleteSubmissionByProblem(DeleteSubmissionByProblemRequest request, StreamObserver<SubmissionResponse> responseObserver) {
        try {
            CommonResponse<SubmissionEntity> result = submissionService.deleteByProblem(request.getProblemId());
            SubmissionResponse response = convertToSubmissionResponse(result);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (ProblemBusinessException e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(Integer.parseInt(e.getErrorCode().getCode()))
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (SubmissionBusinessException e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(Integer.parseInt(e.getErrorCode().getCode()))
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(e.hashCode())
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    }

    @Override
    public void deleteSubmissionByUser(DeleteSubmissionByUserRequest request, StreamObserver<SubmissionResponse> responseObserver) {
        try {
            CommonResponse<SubmissionEntity> result = submissionService.deleteByUser(request.getUserId());
            SubmissionResponse response = convertToSubmissionResponse(result);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (ProblemBusinessException e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(Integer.parseInt(e.getErrorCode().getCode()))
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (SubmissionBusinessException e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(Integer.parseInt(e.getErrorCode().getCode()))
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            var response = SubmissionResponse.newBuilder()
                    .setMessage(e.getMessage())
                    .setCode(e.hashCode())
                    .build();
            log.error("[GRPC Service Error]", e);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    }

    // ==================== Converter Methods ====================

    private SubmissionInputDto convertToInputDto(SubmissionInput input) {
        return SubmissionInputDto.builder()
                .problemId(input.getProblemId())
                .userId(input.getUserId())
                .contestId(input.getContestId())
                .language(input.getLanguage().isEmpty() ? null : LanguageType.valueOf(input.getLanguage()))
                .sourceCode(input.getSourceCode())
                .build();
    }

    private PageRequestDto<SubmissionInputDto> convertToPageRequestDto(GetSubmissionPageRequest request) {
        PageRequestDto<SubmissionInputDto> pageRequest = new PageRequestDto<>();
        pageRequest.setMaxResultCount(request.getPageRequest().getSize());
        pageRequest.setSkipCount(request.getPageRequest().getPage() * request.getPageRequest().getSize());
        pageRequest.setSorting(request.getPageRequest().getSortBy());

        if (request.hasFilter()) {
            pageRequest.setFilter(convertToInputDto(request.getFilter()));
        }

        return pageRequest;
    }

    private SubmissionResponse convertToSubmissionResponse(CommonResponse<SubmissionEntity> result) {
        SubmissionResponse.Builder builder = SubmissionResponse.newBuilder()
                .setCode(result.getIsSuccessful() ? 200 : 500)
                .setMessage(result.getMessage() != null ? result.getMessage() : "");

        if (result.getData() != null) {
            builder.setData(convertToProtoSubmission(result.getData()));
        }

        return builder.build();
    }

    private SubmissionPageResponse convertToSubmissionPageResponse(CommonResponse<PageResult<SubmissionEntity>> result) {
        SubmissionPageResponse.Builder builder = SubmissionPageResponse.newBuilder()
                .setCode(result.getIsSuccessful() ? 200 : 500)
                .setMessage(result.getMessage() != null ? result.getMessage() : "");

        if (result.getData() != null) {
            builder.addAllData(
                    result.getData().getData().stream()
                            .map(this::convertToProtoSubmission)
                            .collect(Collectors.toList())
            );

            builder.setPageResult(com.example.proto.submission.PageResult.newBuilder()
                    .setTotalElements(result.getData().getTotalCount())
                    .build());
        }

        return builder.build();
    }

    private Submission convertToProtoSubmission(SubmissionEntity entity) {
        Submission.Builder builder = Submission.newBuilder();

        if (entity.getSubmissionId() != null) builder.setId(entity.getSubmissionId());
        if (entity.getProblemId() != null) builder.setProblemId(entity.getProblemId());
        if (entity.getUserId() != null) builder.setUserId(entity.getUserId());
        if (entity.getContestId() != null) builder.setContestId(entity.getContestId());
        if (entity.getLanguage() != null) builder.setLanguage(entity.getLanguage().name());
        if (entity.getSourceCode() != null) builder.setSourceCode(entity.getSourceCode());
        if (entity.getSubmittedAt() != null) builder.setCreatedAt(entity.getSubmittedAt().toString());

        if (entity.getResult() != null && !entity.getResult().isEmpty()) {
            builder.setResult(convertToProtoSubmissionResult(entity.getResult()));
        }

        return builder.build();
    }

    private SubmissionResult convertToProtoSubmissionResult(java.util.List<SubmissionResultEntity> results) {
        SubmissionResult.Builder builder = SubmissionResult.newBuilder();

        builder.addAllTestCaseResults(
                results.stream()
                        .map(this::convertToProtoTestCaseResult)
                        .collect(Collectors.toList())
        );

        return builder.build();
    }

    private TestCaseResult convertToProtoTestCaseResult(SubmissionResultEntity entity) {
        TestCaseResult.Builder builder = TestCaseResult.newBuilder();

        if (entity.getTestcaseName() != null) builder.setTestcaseId(entity.getTestcaseName());
        if (entity.getStatus() != null) builder.setStatus(entity.getStatus().name());
        if (entity.getInput() != null) builder.setActualOutput(entity.getInput());
        if (entity.getOutput() != null) builder.setExpectedOutput(entity.getOutput());
        if (entity.getTime() != null) builder.setExecutionTime(entity.getTime().longValue());
        if (entity.getMemory() != null) builder.setMemoryUsed(entity.getMemory().longValue());

        return builder.build();
    }
}
