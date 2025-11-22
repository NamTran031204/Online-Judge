package com.example.jude_service.services.impl;

import com.example.jude_service.entities.judge.TestCaseResult;
import com.example.jude_service.enums.LanguageType;
import com.example.jude_service.enums.ResponseStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class DockerSandboxService {

    private static final long DEFAULT_TIMEOUT = 30; // thoi gian toi da ma docker duoc phep chay, qua thi se timeout RTE

    public TestCaseResult executeTestCase(
            String judgeId,
            String testCaseId,
            String sourceCode,
            LanguageType language,
            String input,
            String expectedOutput,
            double timeLimit,
            double memoryLimit,
            String compileTempDir
    ) {
        long startTime = System.currentTimeMillis();
        TestCaseResult result = TestCaseResult.builder()
                .testCaseId(testCaseId)
                .expectedOutput(expectedOutput)
                .build();

        Path judgeDir = null;
        Path testCaseDir = null;

        try {

            judgeDir = Paths.get(compileTempDir, "judge-" + judgeId);
            testCaseDir = Paths.get(judgeDir.toString(), "testcase_" + testCaseId);
            Files.createDirectories(testCaseDir);

            Path solutionFile = createSolutionFile(judgeDir, sourceCode, language);

            Path inputFile = testCaseDir.resolve("input.txt");
            Path expectedOutputFile = testCaseDir.resolve("expected_output.txt");
            Path outputFile = testCaseDir.resolve("output.txt");
            Path errorFile = testCaseDir.resolve("error.txt");

            Files.writeString(inputFile, input != null ? input : "", StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            Files.writeString(expectedOutputFile, expectedOutput != null ? expectedOutput : "", StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            Files.writeString(outputFile, "", StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            Files.writeString(errorFile, "", StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

            String imageName = getDockerImageName(language);
            int exitCode = executeDocker(
                    imageName,
                    solutionFile,
                    inputFile,
                    outputFile,
                    errorFile,
                    expectedOutputFile,
                    timeLimit,
                    memoryLimit
            );

            long executionTime = System.currentTimeMillis() - startTime;
            result.setExecutionTime(executionTime);

            String actualOutput = Files.readString(outputFile).trim();
            String errorMessage = Files.readString(errorFile).trim();

            result.setActualOutput(actualOutput);
            result.setErrorMessage(errorMessage);

            ResponseStatus verdict = determineVerdict(exitCode, actualOutput, expectedOutput, errorMessage);
            result.setVerdict(verdict);

            result.setMemoryUsed(0L);

            log.info("Test case {} executed with verdict: {}", testCaseId, verdict);

        } catch (Exception e) {
            log.error("Error executing test case {}: {}", testCaseId, e.getMessage(), e);
            result.setVerdict(ResponseStatus.RTE);
            result.setErrorMessage("System error: " + e.getMessage());
            result.setExecutionTime(System.currentTimeMillis() - startTime);
        }

        return result;
    }

    private Path createSolutionFile(Path judgeDir, String sourceCode, LanguageType language) throws IOException {
        String fileName = switch (language) {
            case CPP -> "solution.cpp";
            case JAVA -> "Solution.java";
            case PYTHON -> "solution.py";
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };

        Path solutionFile = judgeDir.resolve(fileName);
        Files.writeString(solutionFile, sourceCode, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
        return solutionFile;
    }

    private String getDockerImageName(LanguageType language) {
        return switch (language) {
            case CPP -> "judge-sandbox-cpp:latest";
            case JAVA -> "judge-sandbox-java:latest";
            case PYTHON -> "judge-sandbox-python:latest";
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }

    private int executeDocker(
            String imageName,
            Path solutionFile,
            Path inputFile,
            Path outputFile,
            Path errorFile,
            Path expectedOutputFile,
            double timeLimit,
            double memoryLimit
    ) throws IOException, InterruptedException {

        // Build Docker command
        List<String> command = new ArrayList<>();
        command.add("docker");
        command.add("run");
        command.add("--rm");
        command.add("--network=none"); // Disable network access for security
        command.add("--cpus=1"); // Limit to 1 CPU

        command.add("-v");
        command.add(solutionFile.toAbsolutePath() + ":/sandbox/imageSolution." + getFileExtension(solutionFile));

        command.add("-v");
        command.add(inputFile + ":/sandbox/imageInput.txt");

        command.add("-v");
        command.add(outputFile + ":/sandbox/imageOutput.txt");

        command.add("-v");
        command.add(errorFile + ":/sandbox/imageError.txt");

        command.add("-v");
        command.add(expectedOutputFile + ":/sandbox/imageExpectedOutput.txt");

        command.add(imageName);

        command.add(String.valueOf((int) Math.ceil(timeLimit)));
        command.add(String.valueOf((int) Math.ceil(memoryLimit)));

        log.info("Executing Docker command: {}", String.join(" ", command));

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);
        
        Process process = processBuilder.start();

        boolean completed = process.waitFor(DEFAULT_TIMEOUT, TimeUnit.SECONDS);
        
        if (!completed) {
            process.destroyForcibly();
            log.error("Docker execution timed out");
            return 124; // timeout exit code
        }

        int exitCode = process.exitValue();
        log.info("Docker execution completed with exit code: {}", exitCode);
        
        return exitCode;
    }

    private String getFileExtension(Path file) {
        String fileName = file.getFileName().toString();
        int lastDot = fileName.lastIndexOf('.');
        return lastDot > 0 ? fileName.substring(lastDot + 1) : "";
    }

    private ResponseStatus determineVerdict(int exitCode, String actualOutput, String expectedOutput, String errorMessage) {
        if (exitCode == 96) {
            return ResponseStatus.CE;
        } else if (exitCode == 124) {
            return ResponseStatus.TLE;
        } else if (exitCode == 139 || exitCode == 137) {
            return ResponseStatus.MLE;
        } else if (exitCode != 0) {
            return ResponseStatus.RTE;
        }

        if (errorMessage != null && !errorMessage.equals("SUCCESS") && 
            (errorMessage.contains("ERROR") || errorMessage.contains("LIMIT_EXCEEDED"))) {
            
            if (errorMessage.contains("COMPILATION_ERROR")) {
                return ResponseStatus.CE;
            } else if (errorMessage.contains("TIME_LIMIT_EXCEEDED")) {
                return ResponseStatus.TLE;
            } else if (errorMessage.contains("MEMORY_LIMIT_EXCEEDED")) {
                return ResponseStatus.MLE;
            } else {
                return ResponseStatus.RTE;
            }
        }

        String normalizedActual = normalizeOutput(actualOutput);
        String normalizedExpected = normalizeOutput(expectedOutput);

        if (normalizedActual.equals(normalizedExpected)) {
            return ResponseStatus.AC;
        } else {
            return ResponseStatus.WA;
        }
    }

    private String normalizeOutput(String output) {
        if (output == null) {
            return "";
        }
        return output.trim().replaceAll("\\r\\n", "\n").replaceAll("\\r", "\n");
    }

    public void cleanupJudgeDirectory(String judgeId, String COMPILE_TEMP_DIR) {
        try {
            Path judgeDir = Paths.get(COMPILE_TEMP_DIR, "judge-" + judgeId);
            if (Files.exists(judgeDir)) {
                deleteDirectory(judgeDir.toFile());
                log.info("Xoa thu muc tam: {}", judgeDir);
            }
        } catch (Exception e) {
            log.error("Loi khi xoa thu muc tam: {}", e.getMessage(), e);
        }
    }

    private void deleteDirectory(File directory) {
        if (directory.isDirectory()) {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    deleteDirectory(file);
                }
            }
        }
        directory.delete();
    }
}