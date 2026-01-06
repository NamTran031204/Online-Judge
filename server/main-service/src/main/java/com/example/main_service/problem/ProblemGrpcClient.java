package com.example.main_service.problem;

import com.example.main_service.problem.dto.ProblemEntity;
import com.example.main_service.problem.dto.ProblemInputDto;
import com.example.main_service.problem.dto.TestcaseEntity;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.sharedAttribute.enums.LanguageType;
import com.example.main_service.sharedAttribute.enums.ProblemLevel;
import com.example.proto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProblemGrpcClient {

    @GrpcClient("jude-service")
    private ProblemServiceGrpc.ProblemServiceBlockingStub problemServiceStub;

    // ==================== API methods (ONLY call gRPC, return raw value) ====================

    public ProblemEntity addProblem(ProblemInputDto input) {
        AddProblemRequest request = AddProblemRequest.newBuilder()
                .setInput(convertToProtoInput(input))
                .build();

        ProblemResponse response = problemServiceStub.addProblem(request);
        return response.hasData() ? convertToEntity(response.getData()) : null;
    }

    public PageResult<ProblemEntity> getProblemPage(PageRequestDto<ProblemInputDto> input) {
        GetProblemPageRequest.Builder req = GetProblemPageRequest.newBuilder()
                .setPageRequest(convertToProtoPageRequest(input));

        if (input != null && input.getFilter() != null) {
            req.setFilter(convertToProtoInput(input.getFilter()));
        }

        ProblemPageResponse response = problemServiceStub.getProblemPage(req.build());
        return convertToPageResult(response);
    }

    public ProblemEntity getProblemById(String problemId) {
        GetProblemByIdRequest request = GetProblemByIdRequest.newBuilder()
                .setProblemId(problemId)
                .build();

        ProblemResponse response = problemServiceStub.getProblemById(request);
        return response.hasData() ? convertToEntity(response.getData()) : null;
    }

    public ProblemEntity updateProblem(ProblemInputDto input, String problemId) {
        UpdateProblemRequest request = UpdateProblemRequest.newBuilder()
                .setProblemId(problemId)
                .setInput(convertToProtoInput(input))
                .build();

        ProblemResponse response = problemServiceStub.updateProblem(request);
        return response.hasData() ? convertToEntity(response.getData()) : null;
    }

    public PageResult<ProblemEntity> getProblemByContest(PageRequestDto<Long> input) {
        GetProblemByContestRequest request = GetProblemByContestRequest.newBuilder()
                .setPageRequest(convertToProtoPageRequest(input))
                .setContestId(input != null && input.getFilter() != null ? input.getFilter() : 0L)
                .build();

        ProblemPageResponse response = problemServiceStub.getProblemByContest(request);
        return convertToPageResult(response);
    }


    public PageResult<ProblemEntity> searchProblem(PageRequestDto<String> input) {
        SearchProblemRequest request = SearchProblemRequest.newBuilder()
                .setPageRequest(convertToProtoPageRequest(input))
                .setKeyword(input != null && input.getFilter() != null ? input.getFilter() : "")
                .build();

        ProblemPageResponse response = problemServiceStub.searchProblem(request);
        return convertToPageResult(response);
    }

    public PageResult<ProblemEntity> searching(PageRequestDto<String> input) {
        return searchProblem(input);
    }

    public ProblemEntity deleteProblem(String problemId) {
        DeleteProblemRequest request = DeleteProblemRequest.newBuilder()
                .setProblemId(problemId)
                .build();

        ProblemResponse response = problemServiceStub.deleteProblem(request);
        return response.hasData() ? convertToEntity(response.getData()) : null;
    }

    public ValidateAndCloneProblemResponse validateAndCloneProblem(Long userId, Long contestId, String problemId) {
        ValidateAndCloneProblemRequest request = ValidateAndCloneProblemRequest.newBuilder()
                .setProblemId(problemId)
                .setContestId(contestId)
                .setUserId(userId)
                .build();

        return problemServiceStub.validateAndCloneProblem(request);
    }

    // ==================== Converter Methods ====================

    private ProblemInput convertToProtoInput(ProblemInputDto input) {
        ProblemInput.Builder builder = ProblemInput.newBuilder();
        if (input == null) return builder.build();

        if (input.getContestId() != null) builder.setContestId(input.getContestId());
        if (input.getTitle() != null) builder.setTitle(input.getTitle());
        if (input.getDescription() != null) builder.setDescription(input.getDescription());
        if (input.getLevel() != null) builder.setLevel(input.getLevel().name());
        if (input.getTimeLimit() != null) builder.setTimeLimit(input.getTimeLimit());
        if (input.getMemoryLimit() != null) builder.setMemoryLimit(input.getMemoryLimit());
        if (input.getInputType() != null) builder.setInputFormat(input.getInputType());
        if (input.getOutputType() != null) builder.setOutputFormat(input.getOutputType());
        if (input.getUserId() != null) builder.setAuthorId(String.valueOf(input.getUserId()));
        if (input.getImageUrls() != null) builder.addAllImageUrls(input.getImageUrls());
        if (input.getSolution() != null) builder.setSolution(input.getSolution());
        if (input.getRating() != null) builder.setRating(input.getRating());
        if (input.getScore() != null) builder.setScore(input.getScore());
        if (input.getTags() != null) builder.addAllTags(input.getTags());

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
        if (testcase == null) return builder.build();

        if (testcase.getInput() != null) builder.setInput(testcase.getInput());
        if (testcase.getOutput() != null) builder.setExpectedOutput(testcase.getOutput());
        if (testcase.getIsSample() != null && testcase.getIsSample()) builder.setIsSample(true);
        if (testcase.getScore() != null) builder.setScore(testcase.getScore());
        if (testcase.getTestcaseName() != null) builder.setTestcaseName(testcase.getTestcaseName());

        return builder.build();
    }

    private <T> PageRequest convertToProtoPageRequest(PageRequestDto<T> input) {
        PageRequest.Builder builder = PageRequest.newBuilder();
        if (input == null) return builder.build();

        if (input.getMaxResultCount() != null) builder.setSize(input.getMaxResultCount());

        // page = skipCount / size (nếu đủ data)
        if (input.getSkipCount() != null && input.getMaxResultCount() != null && input.getMaxResultCount() > 0) {
            builder.setPage(input.getSkipCount() / input.getMaxResultCount());
        }

        if (input.getSorting() != null) builder.setSortBy(input.getSorting());
        return builder.build();
    }

    private PageResult<ProblemEntity> convertToPageResult(ProblemPageResponse response) {
        List<ProblemEntity> entities = response.getDataList().stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());

        long total = response.hasPageResult()
                ? response.getPageResult().getTotalElements()
                : entities.size();

        return PageResult.<ProblemEntity>builder()
                .data(entities)
                .totalCount(total)
                .build();
    }

    private ProblemEntity convertToEntity(Problem proto) {
        return ProblemEntity.builder()
                .problemId(proto.getId())
                .contestId(proto.getContestId())
                .title(proto.getTitle())
                .description(proto.getDescription())
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
                .rating(proto.getRating())
                .score(proto.getScore())
                .solution(proto.getSolution())
                .imageUrls(proto.getImageUrlsList())
                .testcaseEntities(toTestcaseEntities(proto.getTestcasesList()))
                .build();
    }

    public static List<TestcaseEntity> toTestcaseEntities(List<Testcase> testcases) {
        List<TestcaseEntity> out = new ArrayList<>();
        if (testcases == null) return out;

        for (Testcase tc : testcases) {
            out.add(TestcaseEntity.builder()
                    .testcaseName(tc.getId())
                    .input(tc.getInput())
                    .output(tc.getExpectedOutput())
                    .isSample(tc.getIsSample())
                    .score(tc.getScore())
                    .build());
        }
        return out;
    }
}
