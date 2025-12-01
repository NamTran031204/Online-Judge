package com.example.main_service.contest.exceptions.specException;

import com.example.main_service.contest.exceptions.ErrorCode;
import lombok.Getter;

@Getter
public class ProblemBusinessException extends RuntimeException {
    private final ErrorCode errorCode;

    public ProblemBusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public ProblemBusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}
