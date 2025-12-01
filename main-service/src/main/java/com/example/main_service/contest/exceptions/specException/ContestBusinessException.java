package com.example.main_service.contest.exceptions.specException;

import com.example.main_service.contest.exceptions.ErrorCode;
import lombok.Getter;

@Getter
public class ContestBusinessException extends RuntimeException {
    private final ErrorCode errorCode;

    public ContestBusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public ContestBusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}
