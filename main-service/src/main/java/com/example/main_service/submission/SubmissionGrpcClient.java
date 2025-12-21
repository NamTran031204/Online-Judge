package com.example.main_service.submission;

import com.example.main_service.contest.repo.SubmissionResultRepo;
import com.example.main_service.contest.service.ContestService;
import com.example.main_service.dashboard.service.DashBoardService;
import com.example.main_service.problem.ProblemGrpcClient;
import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.sharedAttribute.enums.LanguageType;
import com.example.main_service.sharedAttribute.enums.ResponseStatus;
import com.example.main_service.sharedAttribute.exceptions.ErrorCode;
import com.example.main_service.sharedAttribute.exceptions.specException.ContestBusinessException;
import com.example.main_service.submission.dto.SubmissionEntity;
import com.example.main_service.submission.dto.SubmissionInputDto;
import com.example.main_service.submission.dto.SubmissionResultEntity;
import com.example.proto.submission.*;
import io.grpc.StatusRuntimeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SubmissionGrpcClient {

    private final SubmissionResultRepo submissionResultRepo;
    private final ContestService contestService;
    private final DashBoardService dashBoardService;

    @GrpcClient("jude-service")
    private SubmissionServiceGrpc.SubmissionServiceBlockingStub submissionServiceStub;

    public CommonResponse<SubmissionEntity> submit(SubmissionInputDto input) {
        try {
            SubmitRequest request = SubmitRequest.newBuilder()
                    .setInput(convertToProtoInput(input))
                    .build();

            SubmissionResponse response = submissionServiceStub.submit(request);
            if (response.getCode() != 200) throw(new ContestBusinessException(ErrorCode.INTERNAL_SERVER_ERROR));
            SubmissionEntity submission = convertToEntity(response.getData());

            if (!contestService.isContestRunning(submission.getContestId())) {
                return CommonResponse.fail(ErrorCode.CONTEST_ERROR, "Contest is not running");
            }

            if (!contestService.canUserSubmit(submission.getContestId(), submission.getUserId())) {
                return CommonResponse.fail(
                        ErrorCode.CONTEST_ACCESS_DENY,
                        "User has not registered for this contest"
                );
            }

            dashBoardService.onSubmissionJudged(
                    submission.getSubmissionId(),
                    submission.getUserId(),
                    submission.getContestId(),
                    submission.getProblemId(),
                    true,
                    submission.getSubmittedAt()
                            .atZone(ZoneId.systemDefault())
                            .toEpochSecond()
            );
            return CommonResponse.success(submission);

        } catch (StatusRuntimeException e) {
            log.error("gRPC call failed: {}", e.getStatus(), e);
            return CommonResponse.fail(null, e.getStatus().getDescription());
        }
    }

    public CommonResponse<PageResult<SubmissionEntity>> getPage(PageRequestDto<SubmissionInputDto> pageRequest) {
        try {
            GetSubmissionPageRequest.Builder requestBuilder = GetSubmissionPageRequest.newBuilder()
                    .setPageRequest(convertToProtoPageRequest(pageRequest));

            if (pageRequest.getFilter() != null) {
                requestBuilder.setFilter(convertToProtoInput(pageRequest.getFilter()));
            }

            SubmissionPageResponse response = submissionServiceStub.getSubmissionPage(requestBuilder.build());
            return convertToPageCommonResponse(response);
        } catch (StatusRuntimeException e) {
            log.error("gRPC call failed: {}", e.getStatus(), e);
            return CommonResponse.fail(null, e.getStatus().getDescription());
        }
    }

    public CommonResponse<SubmissionEntity> getById(String submissionId) {
        try {
            GetSubmissionByIdRequest request = GetSubmissionByIdRequest.newBuilder()
                    .setSubmissionId(submissionId)
                    .build();

            SubmissionResponse response = submissionServiceStub.getSubmissionById(request);
            return convertToCommonResponse(response);
        } catch (StatusRuntimeException e) {
            log.error("gRPC call failed: {}", e.getStatus(), e);
            return CommonResponse.fail(null, e.getStatus().getDescription());
        }
    }

    public CommonResponse<SubmissionEntity> deleteById(String submissionId) {
        try {
            DeleteSubmissionByIdRequest request = DeleteSubmissionByIdRequest.newBuilder()
                    .setSubmissionId(submissionId)
                    .build();

            SubmissionResponse response = submissionServiceStub.deleteSubmissionById(request);
            return convertToCommonResponse(response);
        } catch (StatusRuntimeException e) {
            log.error("gRPC call failed: {}", e.getStatus(), e);
            return CommonResponse.fail(null, e.getStatus().getDescription());
        }
    }

    public CommonResponse<SubmissionEntity> deleteByProblem(String problemId) {
        try {
            DeleteSubmissionByProblemRequest request = DeleteSubmissionByProblemRequest.newBuilder()
                    .setProblemId(problemId)
                    .build();

            SubmissionResponse response = submissionServiceStub.deleteSubmissionByProblem(request);
            return convertToCommonResponse(response);
        } catch (StatusRuntimeException e) {
            log.error("gRPC call failed: {}", e.getStatus(), e);
            return CommonResponse.fail(null, e.getStatus().getDescription());
        }
    }

    public CommonResponse<SubmissionEntity> deleteByUser(Long userId) {
        try {
            DeleteSubmissionByUserRequest request = DeleteSubmissionByUserRequest.newBuilder()
                    .setUserId(userId)
                    .build();

            SubmissionResponse response = submissionServiceStub.deleteSubmissionByUser(request);
            return convertToCommonResponse(response);
        } catch (StatusRuntimeException e) {
            log.error("gRPC call failed: {}", e.getStatus(), e);
            return CommonResponse.fail(null, e.getStatus().getDescription());
        }
    }

    // ==================== Converter Methods ====================

    private final ProblemGrpcClient problemGrpcClient;

    private SubmissionInput convertToProtoInput(SubmissionInputDto input) {
        SubmissionInput.Builder builder = SubmissionInput.newBuilder();
        Long contestId = problemGrpcClient.getProblemById(input.getProblemId()).getData().getContestId();

        if (input.getProblemId() != null) builder.setProblemId(input.getProblemId());
        if (input.getUserId() != null) builder.setUserId(input.getUserId());
        if (contestId != null) builder.setContestId(contestId);
        if (input.getLanguage() != null) builder.setLanguage(input.getLanguage().name());
        if (input.getSourceCode() != null) builder.setSourceCode(input.getSourceCode());

        return builder.build();
    }

    private <T> PageRequest convertToProtoPageRequest(PageRequestDto<T> input) {
        PageRequest.Builder builder = PageRequest.newBuilder();
        if (input.getMaxResultCount() != null) builder.setSize(input.getMaxResultCount());
        if (input.getSkipCount() != null) builder.setPage(input.getSkipCount() / input.getMaxResultCount());
        if (input.getSorting() != null) builder.setSortBy(input.getSorting());
        return builder.build();
    }

    private CommonResponse<SubmissionEntity> convertToCommonResponse(SubmissionResponse response) {
        return CommonResponse.<SubmissionEntity>builder()
                .isSuccessful(response.getCode() == 200)
                .code(String.valueOf(response.getCode()))
                .message(response.getMessage())
                .data(response.hasData() ? convertToEntity(response.getData()) : null)
                .build();
    }

    private CommonResponse<PageResult<SubmissionEntity>> convertToPageCommonResponse(SubmissionPageResponse response) {
        List<SubmissionEntity> entities = response.getDataList().stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());

        PageResult<SubmissionEntity> pageResult = PageResult.<SubmissionEntity>builder()
                .data(entities)
                .totalCount(response.hasPageResult() ? response.getPageResult().getTotalElements() : entities.size())
                .build();

        return CommonResponse.<PageResult<SubmissionEntity>>builder()
                .isSuccessful(response.getCode() == 200)
                .code(String.valueOf(response.getCode()))
                .message(response.getMessage())
                .data(pageResult)
                .build();
    }

    private SubmissionEntity convertToEntity(Submission proto) {
        return SubmissionEntity.builder()
                .submissionId(proto.getId())
                .problemId(proto.getProblemId())
                .userId(proto.getUserId())
                .contestId(proto.getContestId())
                .language(proto.getLanguage().isEmpty() ? null : LanguageType.valueOf(proto.getLanguage()))
                .sourceCode(proto.getSourceCode())
                .result(
                        proto.hasResult() ? convertToResultEntities(proto.getResult()) : null
                )
                .submittedAt(LocalDateTime.parse(proto.getCreatedAt()))
                .build();
    }

    private List<SubmissionResultEntity> convertToResultEntities(SubmissionResult protoResult) {
        return protoResult.getTestCaseResultsList().stream()
                .map(this::convertToResultEntity)
                .collect(Collectors.toList());
    }

    private SubmissionResultEntity convertToResultEntity(TestCaseResult proto) {
        return SubmissionResultEntity.builder()
                .testcaseName(proto.getTestcaseId())
                .input(proto.getActualOutput())
                .output(proto.getExpectedOutput())
                .status(proto.getStatus().isEmpty() ? null : ResponseStatus.valueOf(proto.getStatus()))
                .time((float) proto.getExecutionTime())
                .memory((float) proto.getMemoryUsed())
                .build();
    }
}
