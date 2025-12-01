package com.example.main_service.contest.exceptions;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    SUCCESS("200", "Successful", HttpStatus.OK),

    BAD_REQUEST("400", "Bad request", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED("401", "Unauthorized", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("403", "Forbidden", HttpStatus.FORBIDDEN),
    NOT_FOUND("404", "Resource not found", HttpStatus.NOT_FOUND),

    COMPILATION_ERROR("4001", "Code compilation failed", HttpStatus.BAD_REQUEST),
    UNSUPPORTED_LANGUAGE("4003", "Programming language not supported", HttpStatus.BAD_REQUEST),
    SUBMISSION_INVALID("4004", "Invalid submission", HttpStatus.BAD_REQUEST),
    SUBMISSION_NOT_FOUND("4005", "Submission not found", HttpStatus.BAD_REQUEST),

    RUNTIME_ERROR("4101", "Runtime error during execution", HttpStatus.BAD_REQUEST),
    TIME_LIMIT_EXCEEDED("4102", "Execution time limit exceeded", HttpStatus.BAD_REQUEST),
    MEMORY_LIMIT_EXCEEDED("4103", "Memory limit exceeded", HttpStatus.BAD_REQUEST),
    WRONG_ANSWER("4105", "Wrong answer", HttpStatus.BAD_REQUEST),

    PROBLEM_NOT_FOUND("4201", "Problem not found", HttpStatus.NOT_FOUND),
    PROBLEM_VALIDATE("4202", "Problem validate", HttpStatus.BAD_REQUEST),
    TESTCASE_NOT_FOUND("4301", "Test case not found", HttpStatus.NOT_FOUND),

    DOCKER_ERROR("5001", "Docker container error", HttpStatus.INTERNAL_SERVER_ERROR),
    DOCKER_BUILD_FAILED("5002", "Failed to build Docker image", HttpStatus.INTERNAL_SERVER_ERROR),

    FILE_NOT_FOUND("5101", "File not found", HttpStatus.NOT_FOUND),
    FILE_READ_ERROR("5102", "Failed to read file", HttpStatus.INTERNAL_SERVER_ERROR),

    INTERNAL_SERVER_ERROR("500", "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}