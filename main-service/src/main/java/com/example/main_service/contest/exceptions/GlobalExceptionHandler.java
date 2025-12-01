package com.example.main_service.contest.exceptions;

import com.example.main_service.contest.dto.CommonResponse;
import com.example.main_service.contest.exceptions.specException.ContestBusinessException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            ContestBusinessException.class,
//            SubmissionBusinessException.class
    })
    public ResponseEntity<CommonResponse<Object>> handleBusinessException(Exception ex, WebRequest request) {
        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;

        if (ex instanceof ContestBusinessException) {
            errorCode = ((ContestBusinessException) ex).getErrorCode();
        }
//        else if (ex instanceof SubmissionBusinessException) {
//            errorCode = ((SubmissionBusinessException) ex).getErrorCode();
//        }

        CommonResponse<Object> response = CommonResponse.fail(
                errorCode,
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

    @ExceptionHandler({HttpMessageNotReadableException.class})
    public ResponseEntity<CommonResponse<Object>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex, WebRequest request) {
        CommonResponse<Object> response = CommonResponse.fail(
                ErrorCode.INTERNAL_SERVER_ERROR,
                ex.getMessage()
        );

        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus())
                .body(response);
    }
}