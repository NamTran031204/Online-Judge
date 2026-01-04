package com.example.jude_service.services.impl;

import com.example.jude_service.entities.judge.JudgeResult;
import com.example.jude_service.entities.judge.TestCaseResult;
import com.example.jude_service.entities.problem.ProblemEntity;
import com.example.jude_service.entities.submission.SubmissionInputDto;
import com.example.jude_service.entities.testcase.TestcaseEntity;
import com.example.jude_service.enums.ResponseStatus;
import com.example.jude_service.repo.ProblemRepo;
import com.example.jude_service.services.JudgeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JudgeServiceImpl implements JudgeService {

    private final DockerSandboxService dockerSandboxService;
    private final ProblemRepo problemRepo;

    @Override
    public JudgeResult judge(SubmissionInputDto submission, String problemId) throws Exception {
        log.info("Starting judge process for problem: {}, language: {}", problemId, submission.getLanguage());

        String judgeId = UUID.randomUUID() + "_" + problemId + "_" + submission.getUserId() + "_" + submission.getLanguage();

        JudgeResult judgeResult = JudgeResult.builder()
                .submissionId(judgeId)
                .testCaseResults(new ArrayList<>())
                .totalExecutionTime((float) 0)
                .maxMemoryUsed(0L)
                .passedTestCases(0)
                .build();

        Path currentRelativePath = Paths.get("");
        final String COMPILE_TEMP_DIR = String.valueOf(currentRelativePath.toAbsolutePath().resolve("compile-temp"));

        try {
            Optional<ProblemEntity> problemOpt = problemRepo.findById(problemId);
            if (problemOpt.isEmpty()) {
                throw new Exception("Problem not found: " + problemId);
            }

            ProblemEntity problem = problemOpt.get();

            if (!problem.getSupportedLanguage().contains(submission.getLanguage())) {
                judgeResult.setFinalVerdict(ResponseStatus.CE);
                judgeResult.setCompileMessage("Language not supported for this problem");
                return judgeResult;
            }

            List<TestcaseEntity> testCases = problem.getTestcaseEntities();
            if (testCases == null || testCases.isEmpty()) {
                throw new Exception("No test cases found for problem: " + problemId);
            }

            judgeResult.setTotalTestCases(testCases.size());

            double timeLimit = problem.getTimeLimit() != null ? problem.getTimeLimit() : 1.0;
            double memoryLimit = problem.getMemoryLimit() != null ? problem.getMemoryLimit() : 128.0;

            log.info("Executing {} test cases with timeLimit={}s, memoryLimit={}MB", 
                    testCases.size(), timeLimit, memoryLimit);

            int passedCount = 0;
            ResponseStatus finalVerdict = ResponseStatus.AC;
            
            for (int i = 0; i < testCases.size(); i++) {
                TestcaseEntity testCase = testCases.get(i);

                String testcaseId = String.valueOf(i+1);

                log.info("Executing test case {}/{}: {}", i + 1, testCases.size(), testCase.getTestcaseName());

                TestCaseResult testCaseResult = dockerSandboxService.executeTestCase(
                        judgeId,
                        testcaseId,
                        testCase,
                        submission.getSourceCode(),
                        timeLimit,
                        memoryLimit,
                        COMPILE_TEMP_DIR
                );

                judgeResult.getTestCaseResults().add(testCaseResult);

                judgeResult.setTotalExecutionTime(
                        judgeResult.getTotalExecutionTime() + testCaseResult.getExecutionTime()
                );
                
                if (testCaseResult.getMemoryUsed() != null && 
                    testCaseResult.getMemoryUsed() > judgeResult.getMaxMemoryUsed()) {
                    judgeResult.setMaxMemoryUsed(testCaseResult.getMemoryUsed());
                }

                if (testCaseResult.getVerdict() == ResponseStatus.AC) {
                    passedCount++;
                } else {
                    if (finalVerdict == ResponseStatus.AC) {
                        finalVerdict = testCaseResult.getVerdict();
                    }

                    if (testCaseResult.getVerdict() == ResponseStatus.CE) {
                        judgeResult.setCompileMessage(testCaseResult.getErrorMessage());
                        break;
                    }
                }
            }

            judgeResult.setPassedTestCases(passedCount);
            judgeResult.setFinalVerdict(finalVerdict);

            log.info("Judge completed: {}/{} test cases passed, final verdict: {}", 
                    passedCount, testCases.size(), finalVerdict);

        } catch (Exception e) {
            log.error("Error during judge process: {}", e.getMessage(), e);
            judgeResult.setFinalVerdict(ResponseStatus.RTE);
            judgeResult.setCompileMessage("System error: " + e.getMessage());
        } finally {
            dockerSandboxService.cleanupJudgeDirectory(judgeId, COMPILE_TEMP_DIR);
        }

        return judgeResult;
    }
}