package com.example.main_service.sharedAttribute.exceptions;

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

    CONTEST_ERROR("4301", "CONTEST PROBLEM", HttpStatus.BAD_REQUEST),
    CONTEST_INVALID_START_TIME("4302", "CONTEST INVALID START TIME", HttpStatus.BAD_REQUEST),
    CONTEST_NOT_FOUND("4303", "CONTEST NOT FOUND", HttpStatus.NOT_FOUND),
    CONTEST_VALIDATION_ERROR("4304", "CONTEST VALIDATION ERROR", HttpStatus.BAD_REQUEST),
    CONTEST_ACCESS_DENY("4305", "CONTEST ACCESS_DENY", HttpStatus.FORBIDDEN),
    CONTEST_VISIBILITY_CHANGE_FAIL("4306", "CONTEST VISIBILITY CHANGE FAIL", HttpStatus.BAD_REQUEST),

    CONTEST_PROBLEM_ERROR("4401", "CONTEST PROBLEM ERROR", HttpStatus.BAD_REQUEST),
    CONTEST_PROBLEM_NOT_FOUND("4402", "CONTEST PROBLEM NOT FOUND", HttpStatus.BAD_REQUEST),

    PROBLEM_GRPC_ERROR("4500", "PROBLEM GRPC ERROR", HttpStatus.BAD_REQUEST),

    SUBMISSION_RESULT_NOT_FOUND("4501", "SUBMISSION RESULT NOT FOUND", HttpStatus.BAD_REQUEST),

    DOCKER_ERROR("5001", "Docker container error", HttpStatus.INTERNAL_SERVER_ERROR),
    DOCKER_BUILD_FAILED("5002", "Failed to build Docker image", HttpStatus.INTERNAL_SERVER_ERROR),

    FILE_NOT_FOUND("5101", "File not found", HttpStatus.NOT_FOUND),
    FILE_READ_ERROR("5102", "Failed to read file", HttpStatus.INTERNAL_SERVER_ERROR),

    SQL_EXCEPTION("5103", "SQL exception", HttpStatus.INTERNAL_SERVER_ERROR),

    INTERNAL_SERVER_ERROR("500", "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}