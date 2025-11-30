package com.example.jude_service.exceptions.specException;

import com.example.jude_service.exceptions.ErrorCode;
import lombok.Getter;

@Getter
public class SubmissionBusinessException extends RuntimeException {
    private final ErrorCode errorCode;

    public SubmissionBusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public SubmissionBusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}
