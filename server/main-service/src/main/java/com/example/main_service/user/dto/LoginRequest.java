package com.example.main_service.user.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String userName;
    private String password;
}
