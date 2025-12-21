package com.example.jude_service.grpcService;

import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.entities.PageRequestDto;
import com.example.jude_service.entities.PageResult;
import com.example.jude_service.entities.problem.ProblemEntity;
import com.example.jude_service.entities.problem.ProblemInputDto;
import com.example.jude_service.entities.testcase.TestcaseEntity;
import com.example.jude_service.enums.LanguageType;
import com.example.jude_service.enums.ProblemLevel;
import com.example.jude_service.exceptions.ErrorCode;
import com.example.jude_service.exceptions.specException.ProblemBusinessException;
import com.example.jude_service.repo.ProblemRepo;
import com.example.jude_service.services.ProblemService;
import com.example.proto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

import java.util.stream.Collectors;

@Slf4j
@GrpcService
@RequiredArgsConstructor
public class ProblemGrpcService extends ProblemServiceGrpc.ProblemServiceImplBase {

    private final ProblemRepo problemRepo;
    private final ProblemService problemService;

    @Override
    public void validateAndCloneProblem(
            ValidateAndCloneProblemRequest request,
            StreamObserver<ValidateAndCloneProblemResponse> responseObserver
    ) {
        try {
            ProblemEntity problem = problemRepo.findById(request.getProblemId())
                    .orElseThrow(() -> new ProblemBusinessException(ErrorCode.PROBLEM_NOT_FOUND));

            var clonedTestcases = problem.getTestcaseEntities() == null ? null :
                    problem.getTestcaseEntities().stream()
                            .map(tc -> TestcaseEntity.builder()
                                    .testcaseName(tc.getTestcaseName())
                                    .input(tc.getInput())
                                    .output(tc.getOutput())
                                    .isSample(tc.getIsSample())
                                    .description(tc.getDescription())
                                    .score(tc.getScore())
                                    .build())
                            .collect(Collectors.toList());

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
                    .testcaseEntities(clonedTestcases)
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
            // handle riêng problem not found (đang hơi lỏ)
            if (e.getErrorCode() == ErrorCode.PROBLEM_NOT_FOUND) {
                responseObserver.onError(
                        Status.NOT_FOUND
                                .withDescription("Problem not found: " + request.getProblemId())
                                .asRuntimeException()
                );
                return;
            }

            responseObserver.onError(
                    Status.FAILED_PRECONDITION.withDescription(e.getMessage()).asRuntimeException()
            );
        }
    }

    @Override
    public void addProblem(AddProblemRequest request, StreamObserver<ProblemResponse> responseObserver) {
        try {
            ProblemInputDto inputDto = convertToInputDto(request.getInput());
            CommonResponse<ProblemEntity> result = problemService.addProblem(inputDto);
            ProblemResponse response = convertToProblemResponse(result);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }

    @Override
    public void getProblemPage(GetProblemPageRequest request, StreamObserver<ProblemPageResponse> responseObserver) {
        try {
            PageRequestDto<ProblemInputDto> pageRequest = convertToPageRequestDto(request);

            log.info("akldjaskldasklm,djklsd ======{}",request);

            CommonResponse<PageResult<ProblemEntity>> result = problemService.getProblemPage(pageRequest);
            ProblemPageResponse response = convertToProblemPageResponse(result);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }

    @Override
    public void getProblemById(GetProblemByIdRequest request, StreamObserver<ProblemResponse> responseObserver) {
        try {
            CommonResponse<ProblemEntity> result = problemService.getProblemById(request.getProblemId());
            ProblemResponse response = convertToProblemResponse(result);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }

    @Override
    public void updateProblem(UpdateProblemRequest request, StreamObserver<ProblemResponse> responseObserver) {
        try {
            ProblemInputDto inputDto = convertToInputDto(request.getInput());
            CommonResponse<ProblemEntity> result = problemService.updateProblem(inputDto, request.getProblemId());
            ProblemResponse response = convertToProblemResponse(result);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }

    @Override
    public void getProblemByContest(GetProblemByContestRequest request, StreamObserver<ProblemPageResponse> responseObserver) {
        try {
            PageRequestDto<Long> pageRequest = new PageRequestDto<>();
            pageRequest.setMaxResultCount(request.getPageRequest().getSize());
            pageRequest.setSkipCount(request.getPageRequest().getPage() * request.getPageRequest().getSize());
            pageRequest.setSorting(request.getPageRequest().getSortBy());
            pageRequest.setFilter(request.getContestId());

            CommonResponse<PageResult<ProblemEntity>> result = problemService.getByContest(pageRequest);
            ProblemPageResponse response = convertToProblemPageResponse(result);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }

    @Override
    public void searchProblem(SearchProblemRequest request, StreamObserver<ProblemPageResponse> responseObserver) {
        try {
            PageRequestDto<String> pageRequest = new PageRequestDto<>();
            pageRequest.setMaxResultCount(request.getPageRequest().getSize());
            pageRequest.setSkipCount(request.getPageRequest().getPage() * request.getPageRequest().getSize());
            pageRequest.setSorting(request.getPageRequest().getSortBy());
            pageRequest.setFilter(request.getKeyword());

            CommonResponse<PageResult<ProblemEntity>> result = problemService.searching(pageRequest);
            ProblemPageResponse response = convertToProblemPageResponse(result);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }

    @Override
    public void deleteProblem(DeleteProblemRequest request, StreamObserver<ProblemResponse> responseObserver) {
        try {
            CommonResponse<ProblemEntity> result = problemService.deleteProblem(request.getProblemId());
            ProblemResponse response = convertToProblemResponse(result);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }

    // ==================== Converter Methods ====================

    private ProblemInputDto convertToInputDto(ProblemInput input) {
        ProblemInputDto dto = new ProblemInputDto();
        dto.setTitle(input.getTitle());
        dto.setDescription(input.getDescription());
        dto.setContestId(input.getContestId());
        dto.setInputType(input.getInputFormat());
        dto.setOutputType(input.getOutputFormat());
        dto.setTimeLimit(input.getTimeLimit());
        dto.setMemoryLimit(input.getMemoryLimit());

        if (!input.getLevel().isEmpty()) {
            dto.setLevel(ProblemLevel.valueOf(input.getLevel()));
        }

        if (!input.getAuthorId().isEmpty()) {
            dto.setUserId(Long.parseLong(input.getAuthorId()));
        }

        dto.setTags(input.getTagsList());

        dto.setSupportedLanguage(
                input.getSupportedLanguagesList().stream()
                        .map(LanguageType::valueOf)
                        .collect(Collectors.toList())
        );

        dto.setTestcaseEntities(
                input.getTestcasesList().stream()
                        .map(tc -> TestcaseEntity.builder()
                                .input(tc.getInput())
                                .output(tc.getExpectedOutput())
                                .isSample(tc.getIsSample())
                                .score(tc.getScore())
                                .testcaseName(tc.getTestcaseName())
                                .build())
                        .collect(Collectors.toList())
        );

        dto.setImageUrls(input.getImageUrlsList());
        dto.setSolution(input.getSolution());

        if (input.getRating() > 0) dto.setRating(input.getRating()); // do cái đầu buồi này là kiểu nguyên thủy nên không thể là null
        if (input.getScore() > 0) dto.setScore(input.getScore());

        log.info("=========Inside convertToInputDto====={}",input);
        return dto;
    }

    private PageRequestDto<ProblemInputDto> convertToPageRequestDto(GetProblemPageRequest request) {
        PageRequestDto<ProblemInputDto> pageRequest = new PageRequestDto<>();
        pageRequest.setMaxResultCount(request.getPageRequest().getSize());
        pageRequest.setSkipCount(request.getPageRequest().getPage() * request.getPageRequest().getSize());
        pageRequest.setSorting(request.getPageRequest().getSortBy());

        if (request.hasFilter()) {
            pageRequest.setFilter(convertToInputDto(request.getFilter()));
        }

        return pageRequest;
    }

    private ProblemResponse convertToProblemResponse(CommonResponse<ProblemEntity> result) {
        ProblemResponse.Builder builder = ProblemResponse.newBuilder()
                .setCode(result.getIsSuccessful() ? 200 : 500)
                .setMessage(result.getMessage() != null ? result.getMessage() : "");

        if (result.getData() != null) {
            builder.setData(convertToProtoProblem(result.getData()));
        }

        return builder.build();
    }

    private ProblemPageResponse convertToProblemPageResponse(CommonResponse<PageResult<ProblemEntity>> result) {
        ProblemPageResponse.Builder builder = ProblemPageResponse.newBuilder()
                .setCode(result.getIsSuccessful() ? 200 : 500)
                .setMessage(result.getMessage() != null ? result.getMessage() : "");

        if (result.getData() != null) {
            builder.addAllData(
                    result.getData().getData().stream()
                            .map(this::convertToProtoProblem)
                            .collect(Collectors.toList())
            );

            builder.setPageResult(com.example.proto.PageResult.newBuilder()
                    .setTotalElements(result.getData().getTotalCount())
                    .build());
        }

        return builder.build();
    }

    private Problem convertToProtoProblem(ProblemEntity entity) {
        Problem.Builder builder = Problem.newBuilder();

        if (entity.getProblemId() != null) builder.setId(entity.getProblemId());
        if (entity.getTitle() != null) builder.setTitle(entity.getTitle());
        if (entity.getDescription() != null) builder.setDescription(entity.getDescription());
        if (entity.getContestId() != null) builder.setContestId(Long.valueOf(entity.getContestId()));
        if (entity.getLevel() != null) builder.setLevel(entity.getLevel().name());
        if (entity.getTimeLimit() != null) builder.setTimeLimit(entity.getTimeLimit().intValue());
        if (entity.getMemoryLimit() != null) builder.setMemoryLimit(entity.getMemoryLimit().intValue());
        if (entity.getInputType() != null) builder.setInputFormat(entity.getInputType());
        if (entity.getOutputType() != null) builder.setOutputFormat(entity.getOutputType());
        if (entity.getAuthorId() != null) builder.setAuthorId(String.valueOf(entity.getAuthorId()));
        if (entity.getCreatedAt() != null) builder.setCreatedAt(entity.getCreatedAt().toString());
        if (entity.getLastModifiedDate() != null) builder.setUpdatedAt(entity.getLastModifiedDate().toString());

        if (entity.getImageUrls() != null) builder.addAllImageUrls(entity.getImageUrls()); // <-- THÊM
        if (entity.getSolution() != null) builder.setSolution(entity.getSolution());   // <-- THÊM
        if (entity.getRating() != null) builder.setRating(entity.getRating()); // <-- THÊM
        if (entity.getScore() != null) builder.setScore(entity.getScore());    // <-- THÊM

        if (entity.getTags() != null) {
            builder.addAllTags(entity.getTags());
        }

        if (entity.getSupportedLanguage() != null) {
            builder.addAllSupportedLanguages(
                    entity.getSupportedLanguage().stream()
                            .map(LanguageType::name)
                            .collect(Collectors.toList())
            );
        }

        if (entity.getTestcaseEntities() != null) {
            builder.addAllTestcases(
                    entity.getTestcaseEntities().stream()
                            .map(this::convertToProtoTestcase)
                            .collect(Collectors.toList())
            );
        }

        return builder.build();
    }

    private Testcase convertToProtoTestcase(TestcaseEntity entity) {
        Testcase.Builder builder = Testcase.newBuilder();
        if (entity.getTestcaseName() != null) builder.setId(entity.getTestcaseName());
        if (entity.getInput() != null) builder.setInput(entity.getInput());
        if (entity.getOutput() != null) builder.setExpectedOutput(entity.getOutput());
        if (entity.getIsSample() != null) builder.setIsSample(entity.getIsSample());  // <-- THÊM (nếu có)
        if (entity.getScore()!=null) builder.setScore(entity.getScore());
        return builder.build();
    }
}
