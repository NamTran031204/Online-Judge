package com.example.main_service.sharedAttribute.api;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Path;

public interface MinioService {
    String upload(MultipartFile file, String objectName);
    InputStream getFile(String objectName);
    String uploadLocalFile(Path path, String objectName);
    void deleteFile(String objectName);
}
