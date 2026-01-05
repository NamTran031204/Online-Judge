package com.example.main_service.sharedAttribute.api;

import com.example.main_service.contest.utils.StringUtils;
import io.minio.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioServiceImpl implements MinioService {

    private final MinioClient minioClient;
    @Value("${minio.bucket-name}")
    private String bucketName;

    @Override
    public String upload(MultipartFile file, String objectName) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                            .build()
            );
            return objectName;
        } catch (Exception e) {
            log.error("error on save file", e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public InputStream getFile(String objectName) {

        if (StringUtils.isNullOrBlank(objectName)) {
            throw new IllegalArgumentException("Object name is empty");
        }

        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {
            log.error("error on get file", e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public String uploadLocalFile(Path path, String objectName) {
        try {
            if (!Files.exists(path)) {
                throw new RuntimeException("File does not exist");
            }
            minioClient.uploadObject(
                    UploadObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .filename(path.toString())
                            .build()
            );
            return objectName;
        } catch (Exception e) {
            log.error("error on save file", e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteFile(String objectName) {
        if (StringUtils.isNullOrBlank(objectName)) {
            throw new IllegalArgumentException("Object name is empty");
        }
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {
            log.error("error on delete file", e);
            throw new RuntimeException(e);
        }
    }
}
