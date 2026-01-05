package com.example.jude_service.entities.judge;

import lombok.Builder;
import lombok.Data;

import java.io.InputStream;

@Data
@Builder
public class MinIOFileDto {
    private InputStream file;
    private String fileName; // de detect ngon ngu
}
