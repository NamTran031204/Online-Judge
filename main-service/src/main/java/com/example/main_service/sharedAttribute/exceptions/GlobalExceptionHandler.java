package com.example.main_service.sharedAttribute.exceptions;

import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.sharedAttribute.exceptions.specException.ContestBusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.sql.SQLException;

@RestControllerAdvice
@Slf4j
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

        log.error("[Specific Error]: ", ex);

        CommonResponse<Object> response = CommonResponse.fail(
                errorCode,
                ex.getMessage()
        );

        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus())
                .body(response);
    }

    @ExceptionHandler(SQLException.class)
    public ResponseEntity<CommonResponse<Object>> handleGlobalException(Exception ex, WebRequest request) {
        CommonResponse<Object> response = CommonResponse.fail(
                ErrorCode.INTERNAL_SERVER_ERROR
        );

        log.error("[SQL Error]: ", ex);

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

        log.error("[HTTP Message Not Readable]: ", ex);

        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus())
                .body(response);
    }
}