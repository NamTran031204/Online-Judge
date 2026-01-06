package com.example.main_service.sharedAttribute.api;

import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@RestController
@RequestMapping("${api.prefix}/file")
@RequiredArgsConstructor
public class FileApiResource {

    private final MinioService minioService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CommonResponse<String> upload(@RequestParam("file") MultipartFile file) {
        String objectName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String res = minioService.upload(file, objectName);
        return CommonResponse.success(res);
    }

//    @GetMapping("/download/{objectName}")
//    public ResponseEntity<StreamingResponseBody> download(@PathVariable("objectName") String objectName) {
//
//        InputStream inputStream = minioService.getFile(objectName);
//
//        StreamingResponseBody stream = os -> {
//            try (BufferedReader reader =
//                         new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
//
//                String line;
//                while ((line = reader.readLine()) != null) {
//                    os.write(line.getBytes(StandardCharsets.UTF_8));
//                    os.write('\n');
//                }
//            }
//        };
//
//        return ResponseEntity.ok()
//                .contentType(MediaType.TEXT_PLAIN)
//                .body(stream);
//    }

    @GetMapping("/download/{objectName}")
    public ResponseEntity<String> download(@PathVariable("objectName") String objectName) {
        try (InputStream inputStream = minioService.getFile(objectName)) {
            // Đọc toàn bộ file thành String
            String content = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .body(content);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error downloading file: " + e.getMessage());
        }
    }
}
