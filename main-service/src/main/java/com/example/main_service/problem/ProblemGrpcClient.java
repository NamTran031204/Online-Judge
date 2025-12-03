package com.example.main_service.problem;

import com.example.main_service.problem.dto.ProblemEntity;
import com.example.main_service.problem.dto.ProblemInputDto;
import com.example.main_service.problem.dto.TestcaseEntity;
import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.sharedAttribute.enums.LanguageType;
import com.example.main_service.sharedAttribute.enums.ProblemLevel;
import com.example.proto.*;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProblemGrpcClient {

    @GrpcClient("jude-service")
    private ProblemServiceGrpc.ProblemServiceBlockingStub problemServiceStub;

    public CommonResponse<ProblemEntity> addProblem(ProblemInputDto input) {
        try {
            AddProblemRequest request = AddProblemRequest.newBuilder()
                    .setInput(convertToProtoInput(input))
                    .build();

            ProblemResponse response = problemServiceStub.addProblem(request);
            return convertToCommonResponse(response);
        } catch (StatusRuntimeException e) {
            log.error("gRPC call failed: {}", e.getStatus(), e);
            return CommonResponse.fail(null, e.getStatus().getDescription());
        }
    }

    public CommonResponse<PageResult<ProblemEntity>> getProblemPage(PageRequestDto<ProblemInputDto> input) {
        try {
            GetProblemPageRequest.Builder requestBuilder = GetProblemPageRequest.newBuilder()
                    .setPageRequest(convertToProtoPageRequest(input));

            if (input.getFilter() != null) {
                requestBuilder.setFilter(convertToProtoInput(input.getFilter()));
            }

            ProblemPageResponse response = problemServiceStub.getProblemPage(requestBuilder.build());
            return convertToPageCommonResponse(response);
        } catch (StatusRuntimeException e) {
            log.error("gRPC call failed: {}", e.getStatus(), e);
            return CommonResponse.fail(null, e.getStatus().getDescription());
        }
    }

    public CommonResponse<ProblemEntity> getProblemById(String problemId) {
        try {
            GetProblemByIdRequest request = GetProblemByIdRequest.newBuilder()
                    .setProblemId(problemId)
                    .build();

            ProblemResponse response = problemServiceStub.getProblemById(request);
            return convertToCommonResponse(response);
        } catch (StatusRuntimeException e) {
            log.error("gRPC call failed: {}", e.getStatus(), e);
            return CommonResponse.fail(null, e.getStatus().getDescription());
        }
    }

    public CommonResponse<ProblemEntity> updateProblem(ProblemInputDto input, String problemId) {
        try {
            UpdateProblemRequest request = UpdateProblemRequest.newBuilder()
                    .setProblemId(problemId)
                    .setInput(convertToProtoInput(input))
                    .build();

            ProblemResponse response = problemServiceStub.updateProblem(request);
            return convertToCommonResponse(response);
        } catch (StatusRuntimeException e) {
            log.error("gRPC call failed: {}", e.getStatus(), e);
            return CommonResponse.fail(null, e.getStatus().getDescription());
        }
    }

    public CommonResponse<PageResult<ProblemEntity>> getProblemByContest(PageRequestDto<String> input) {
        try {
            GetProblemByContestRequest request = GetProblemByContestRequest.newBuilder()
                    .setPageRequest(convertToProtoPageRequest(input))
                    .setContestId(input.getFilter() != null ? input.getFilter() : "")
                    .build();

            ProblemPageResponse response = problemServiceStub.getProblemByContest(request);
            return convertToPageCommonResponse(response);
        } catch (StatusRuntimeException e) {
            log.error("gRPC call failed: {}", e.getStatus(), e);
            return CommonResponse.fail(null, e.getStatus().getDescription());
        }
    }

    public CommonResponse<PageResult<ProblemEntity>> getByContest(PageRequestDto<String> input) {
        return getProblemByContest(input);
    }

    public CommonResponse<PageResult<ProblemEntity>> searchProblem(PageRequestDto<String> input) {
        try {
            SearchProblemRequest request = SearchProblemRequest.newBuilder()
                    .setPageRequest(convertToProtoPageRequest(input))
                    .setKeyword(input.getFilter() != null ? input.getFilter() : "")
                    .build();

            ProblemPageResponse response = problemServiceStub.searchProblem(request);
            return convertToPageCommonResponse(response);
        } catch (StatusRuntimeException e) {
            log.error("gRPC call failed: {}", e.getStatus(), e);
            return CommonResponse.fail(null, e.getStatus().getDescription());
        }
    }

    public CommonResponse<PageResult<ProblemEntity>> searching(PageRequestDto<String> input) {
        return searchProblem(input);
    }

    public CommonResponse<ProblemEntity> deleteProblem(String problemId) {
        try {
            DeleteProblemRequest request = DeleteProblemRequest.newBuilder()
                    .setProblemId(problemId)
                    .build();

            ProblemResponse response = problemServiceStub.deleteProblem(request);
            return convertToCommonResponse(response);
        } catch (StatusRuntimeException e) {
            log.error("gRPC call failed: {}", e.getStatus(), e);
            return CommonResponse.fail(null, e.getStatus().getDescription());
        }
    }

    // ==================== Converter Methods ====================

    private ProblemInput convertToProtoInput(ProblemInputDto input) {
        ProblemInput.Builder builder = ProblemInput.newBuilder();

        if (input.getTitle() != null) builder.setTitle(input.getTitle());
        if (input.getDescription() != null) builder.setDescription(input.getDescription());
        if (input.getContestId() != null) builder.setContestId(input.getContestId());
        if (input.getLevel() != null) builder.setLevel(input.getLevel().name());
        if (input.getTimeLimit() != null) builder.setTimeLimit(input.getTimeLimit().intValue());
        if (input.getMemoryLimit() != null) builder.setMemoryLimit(input.getMemoryLimit().intValue());
        if (input.getInputType() != null) builder.setInputFormat(input.getInputType());
        if (input.getOutputType() != null) builder.setOutputFormat(input.getOutputType());
        if (input.getUserId() != null) builder.setAuthorId(String.valueOf(input.getUserId()));

        if (input.getTags() != null) {
            builder.addAllTags(input.getTags());
        }

        if (input.getSupportedLanguage() != null) {
            builder.addAllSupportedLanguages(
                    input.getSupportedLanguage().stream()
                            .map(LanguageType::name)
                            .collect(Collectors.toList())
            );
        }

        if (input.getTestcaseEntities() != null) {
            builder.addAllTestcases(
                    input.getTestcaseEntities().stream()
                            .map(this::convertToProtoTestcaseInput)
                            .collect(Collectors.toList())
            );
        }

        return builder.build();
    }

    private TestcaseInput convertToProtoTestcaseInput(TestcaseEntity testcase) {
        TestcaseInput.Builder builder = TestcaseInput.newBuilder();
        if (testcase.getInput() != null) builder.setInput(testcase.getInput());
        if (testcase.getOutput() != null) builder.setExpectedOutput(testcase.getOutput());
        return builder.build();
    }

    private <T> PageRequest convertToProtoPageRequest(PageRequestDto<T> input) {
        PageRequest.Builder builder = PageRequest.newBuilder();
        if (input.getMaxResultCount() != null) builder.setSize(input.getMaxResultCount());
        if (input.getSkipCount() != null) builder.setPage(input.getSkipCount() / input.getMaxResultCount());
        if (input.getSorting() != null) builder.setSortBy(input.getSorting());
        return builder.build();
    }

    private CommonResponse<ProblemEntity> convertToCommonResponse(ProblemResponse response) {
        return CommonResponse.<ProblemEntity>builder()
                .isSuccessful(response.getCode() == 200)
                .code(String.valueOf(response.getCode()))
                .message(response.getMessage())
                .data(response.hasData() ? convertToEntity(response.getData()) : null)
                .build();
    }

    private CommonResponse<PageResult<ProblemEntity>> convertToPageCommonResponse(ProblemPageResponse response) {
        List<ProblemEntity> entities = response.getDataList().stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());

        PageResult<ProblemEntity> pageResult = PageResult.<ProblemEntity>builder()
                .data(entities)
                .totalCount(response.hasPageResult() ? response.getPageResult().getTotalElements() : entities.size())
                .build();

        return CommonResponse.<PageResult<ProblemEntity>>builder()
                .isSuccessful(response.getCode() == 200)
                .code(String.valueOf(response.getCode()))
                .message(response.getMessage())
                .data(pageResult)
                .build();
    }

    private ProblemEntity convertToEntity(Problem proto) {
        return ProblemEntity.builder()
                .problemId(proto.getId())
                .title(proto.getTitle())
                .description(proto.getDescription())
                .contestId(proto.getContestId().isEmpty() ? null : Long.parseLong(proto.getContestId()))
                .level(proto.getLevel().isEmpty() ? null : ProblemLevel.valueOf(proto.getLevel()))
                .timeLimit((double) proto.getTimeLimit())
                .memoryLimit((double) proto.getMemoryLimit())
                .inputType(proto.getInputFormat())
                .outputType(proto.getOutputFormat())
                .authorId(proto.getAuthorId().isEmpty() ? null : Long.parseLong(proto.getAuthorId()))
                .tags(proto.getTagsList())
                .supportedLanguage(
                        proto.getSupportedLanguagesList().stream()
                                .map(LanguageType::valueOf)
                                .collect(Collectors.toList())
                )
                .testcaseEntities(
                        proto.getTestcasesList().stream()
                                .map(this::convertToTestcaseEntity)
                                .collect(Collectors.toList())
                )
                .build();
    }

    private TestcaseEntity convertToTestcaseEntity(Testcase proto) {
        return TestcaseEntity.builder()
                .testcaseName(proto.getId())
                .input(proto.getInput())
                .output(proto.getExpectedOutput())
                .build();
    }
}
