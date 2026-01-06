package com.example.jude_service.exceptions;

import com.example.jude_service.entities.CommonResponse;
import com.example.jude_service.exceptions.specException.ProblemBusinessException;
import com.example.jude_service.exceptions.specException.SubmissionBusinessException;
import com.mongodb.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler({
            ProblemBusinessException.class,
            SubmissionBusinessException.class
    })
    public ResponseEntity<CommonResponse<Object>> handleBusinessException(Exception ex, WebRequest request) {
        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;

        if (ex instanceof ProblemBusinessException) {
            errorCode = ((ProblemBusinessException) ex).getErrorCode();
        } else if (ex instanceof SubmissionBusinessException) {
            errorCode = ((SubmissionBusinessException) ex).getErrorCode();
        }

        CommonResponse<Object> response = CommonResponse.fail(
                errorCode,
                ex.getMessage()
        );

        log.error("[Specific Error]: ", ex);

        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus())
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponse<Object>> handleGlobalException(Exception ex, WebRequest request) {
        CommonResponse<Object> response = CommonResponse.fail(
                ErrorCode.INTERNAL_SERVER_ERROR
        );

        log.error("[Internal Error]: ", ex);

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

        log.error("[Http Message Not Readable Error]: ", ex);

        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus())
                .body(response);
    }

    @ExceptionHandler({
            MongoException.class,
            MongoClientException.class,
            MongoCommandException.class,
            MongoWriteException.class,
            MongoWriteConcernException.class,
            MongoTimeoutException.class,
            MongoSecurityException.class
    })
    public ResponseEntity<CommonResponse<Object>> handleMongoError(Exception ex, WebRequest request) {
        CommonResponse<Object> response = CommonResponse.fail(
                ErrorCode.MONGO_ERROR
        );

        log.error("[MONGO Error]: ", ex);
        return ResponseEntity
                .status(ErrorCode.MONGO_ERROR.getHttpStatus())
                .body(response);
    }
}