package com.example.jude_service.exceptions;

import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.exceptions.specException.ProblemBusinessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            ProblemBusinessException.class
    })
    public ResponseEntity<CommonResponse<Object>> handleBusinessException(ProblemBusinessException ex, WebRequest request) {
        CommonResponse<Object> response = CommonResponse.fail(
                ex.getErrorCode(),
                ex.getMessage()
        );

        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus())
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponse<Object>> handleGlobalException(Exception ex, WebRequest request) {
        CommonResponse<Object> response = CommonResponse.fail(
                ErrorCode.INTERNAL_SERVER_ERROR
        );

        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus())
                .body(response);
    }
}