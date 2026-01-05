package com.example.main_service.submission;

import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.sharedAttribute.enums.LanguageType;
import com.example.main_service.sharedAttribute.enums.ResponseStatus;
import com.example.main_service.submission.dto.SubmissionEntity;
import com.example.main_service.submission.dto.SubmissionInputDto;
import com.example.main_service.submission.dto.SubmissionResultEntity;
import com.example.proto.submission.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SubmissionGrpcClient {

    @GrpcClient("jude-service")
    private SubmissionServiceGrpc.SubmissionServiceBlockingStub submissionServiceStub;

    public SubmissionEntity submit(SubmissionInputDto input) {
        SubmitRequest request = SubmitRequest.newBuilder()
                .setInput(convertToProtoInput(input))
                .build();

        SubmissionResponse response = submissionServiceStub.submit(request);
        return response.hasData() ? convertToEntity(response.getData()) : null;
    }

    public PageResult<SubmissionEntity> getPage(PageRequestDto<SubmissionInputDto> pageRequest) {
        GetSubmissionPageRequest.Builder requestBuilder = GetSubmissionPageRequest.newBuilder()
                .setPageRequest(convertToProtoPageRequest(pageRequest));

        if (pageRequest != null && pageRequest.getFilter() != null) {
            requestBuilder.setFilter(convertToProtoInput(pageRequest.getFilter()));
        }

        SubmissionPageResponse response = submissionServiceStub.getSubmissionPage(requestBuilder.build());
        return convertToPageResult(response);
    }

    public SubmissionEntity getById(String submissionId) {
        GetSubmissionByIdRequest request = GetSubmissionByIdRequest.newBuilder()
                .setSubmissionId(submissionId)
                .build();

        SubmissionResponse response = submissionServiceStub.getSubmissionById(request);
        return response.hasData() ? convertToEntity(response.getData()) : null;
    }

    public SubmissionEntity deleteById(String submissionId) {
        DeleteSubmissionByIdRequest request = DeleteSubmissionByIdRequest.newBuilder()
                .setSubmissionId(submissionId)
                .build();

        SubmissionResponse response = submissionServiceStub.deleteSubmissionById(request);
        return response.hasData() ? convertToEntity(response.getData()) : null;
    }

    public SubmissionEntity deleteByProblem(String problemId) {
        DeleteSubmissionByProblemRequest request = DeleteSubmissionByProblemRequest.newBuilder()
                .setProblemId(problemId)
                .build();

        SubmissionResponse response = submissionServiceStub.deleteSubmissionByProblem(request);
        return response.hasData() ? convertToEntity(response.getData()) : null;
    }

    public SubmissionEntity deleteByUser(Long userId) {
        DeleteSubmissionByUserRequest request = DeleteSubmissionByUserRequest.newBuilder()
                .setUserId(userId)
                .build();

        SubmissionResponse response = submissionServiceStub.deleteSubmissionByUser(request);
        return response.hasData() ? convertToEntity(response.getData()) : null;
    }

    // ==================== Converter Methods ====================

    private SubmissionInput convertToProtoInput(SubmissionInputDto input) {
        SubmissionInput.Builder builder = SubmissionInput.newBuilder();
        if (input == null) return builder.build();

        if (input.getProblemId() != null) builder.setProblemId(input.getProblemId());
        if (input.getUserId() != null) builder.setUserId(input.getUserId());

        // contestId: để service layer set trước khi gọi grpc (không fetch ở grpc client)
        if (input.getContestId() != null) builder.setContestId(input.getContestId());

        if (input.getLanguage() != null) builder.setLanguage(input.getLanguage().name());
        if (input.getSourceCode() != null) builder.setSourceCode(input.getSourceCode());

        return builder.build();
    }

    private <T> PageRequest convertToProtoPageRequest(PageRequestDto<T> input) {
        PageRequest.Builder builder = PageRequest.newBuilder();
        if (input == null) return builder.build();

        if (input.getMaxResultCount() != null) builder.setSize(input.getMaxResultCount());
        if (input.getSkipCount() != null && input.getMaxResultCount() != null && input.getMaxResultCount() > 0) {
            builder.setPage(input.getSkipCount() / input.getMaxResultCount());
        }
        if (input.getSorting() != null) builder.setSortBy(input.getSorting());
        return builder.build();
    }

    private PageResult<SubmissionEntity> convertToPageResult(SubmissionPageResponse response) {
        List<SubmissionEntity> entities = response.getDataList().stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());

        long total = response.hasPageResult()
                ? response.getPageResult().getTotalElements()
                : entities.size();

        return PageResult.<SubmissionEntity>builder()
                .data(entities)
                .totalCount(total)
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
                .result(proto.hasResult() ? convertToResultEntities(proto.getResult()) : null)
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
