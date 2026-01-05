package com.example.jude_service.exceptions.specException;

import com.example.jude_service.exceptions.ErrorCode;
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
