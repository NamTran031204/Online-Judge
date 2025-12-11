package com.example.main_service.sharedAttribute.exceptions.specException;

import com.example.main_service.sharedAttribute.exceptions.ErrorCode;
import lombok.Getter;

@Getter
public class UserBusinessException extends RuntimeException {
    private final ErrorCode errorCode;

    public UserBusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
