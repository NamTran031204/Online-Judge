package com.example.main_service.user.controller;

import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.user.dto.*;
import com.example.main_service.user.service.AuthService;
import com.example.main_service.user.service.TokenService;
import org.springframework.web.bind.annotation.*;

// to do : handle exception

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;

    public AuthController(AuthService authService, TokenService tokenService) {
        this.authService = authService;
        this.tokenService = tokenService;
    }

    // ------------------ REGISTER ------------------
    @PostMapping("/register")
    public CommonResponse<RegisterResponse> register(@RequestBody RegisterRequest req) {
        Long userId = authService.register(req);
        RegisterResponse response =  new RegisterResponse(
                userId, req.getUserName(), req.getEmail()
        );
        return CommonResponse.success(response);
    }

    // ------------------ LOGIN ------------------
    @PostMapping("/login")
    public CommonResponse<LoginResponse> login(@RequestBody LoginRequest req,
                               @RequestHeader(value = "X-Forwarded-For", required = false) String ip,
                               @RequestHeader(value = "X-Real-IP", required = false) String ipReal,
                               @RequestHeader(value = "Host", required = false) String host) {

        // Lấy IP (ưu tiên headers reverse proxy)
        String clientIp = ip != null ? ip :
                ipReal != null ? ipReal :
                        host != null ? host : "unknown";

        LoginResponse loginResponse = authService.login(req, clientIp);

        return CommonResponse.success(loginResponse);
    }

    // ------------------ REFRESH ACCESS TOKEN ------------------
    @PostMapping("/refresh")
    public CommonResponse<RefreshResponse> refresh(@RequestBody RefreshRequest req) {

        Long userId = tokenService.validateRefreshToken(req.getRefreshToken());

        if (userId == null) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        String newAccessToken = tokenService.newAccessToken(userId);

        RefreshResponse res = new RefreshResponse(
                newAccessToken,
                tokenService.getAccessTokenExpiry()
        );

        return CommonResponse.success(res);
    }

    // ------------------ LOGOUT ------------------
    @PostMapping("/logout")
    public CommonResponse<String> logout(@RequestBody RefreshRequest req) {
        tokenService.revokeRefreshToken(req.getRefreshToken());
        return CommonResponse.success("Logged out");
    }
}
