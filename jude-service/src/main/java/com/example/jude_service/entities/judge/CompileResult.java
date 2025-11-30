package com.example.jude_service.entities.judge;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CompileResult {
    private final boolean success;
    private final String message;
}