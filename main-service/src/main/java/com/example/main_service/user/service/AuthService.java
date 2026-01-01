package com.example.main_service.user.service;

import com.example.main_service.user.dto.LoginRequest;
import com.example.main_service.user.dto.LoginResponse;
import com.example.main_service.user.dto.RegisterRequest;
import com.example.main_service.user.dto.RegisterResponse;


public interface AuthService {
    public RegisterResponse register(RegisterRequest req);
    public LoginResponse login(LoginRequest req, String ipAddr);
}
