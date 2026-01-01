package com.example.main_service.user.controller;

import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.sharedAttribute.exceptions.specException.InvalidRefreshTokenException;
import com.example.main_service.user.dto.*;
import com.example.main_service.user.service.AuthService;
import com.example.main_service.user.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor

public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;

    @PostMapping("/register")
    public CommonResponse<RegisterResponse> register(@RequestBody RegisterRequest req) {
        return CommonResponse.success(authService.register(req));
    }

    @PostMapping("/login")
    public CommonResponse<LoginResponse> login(@RequestBody LoginRequest req,
                               @RequestHeader(value = "X-Forwarded-For", required = false) String ip,
                               @RequestHeader(value = "X-Real-IP", required = false) String ipReal,
                               @RequestHeader(value = "Host", required = false) String host) {

        String clientIp = ip != null ? ip : ipReal != null ? ipReal : host != null ? host : "unknown"; // may be ratelimit ?
        return CommonResponse.success(authService.login(req, clientIp));
    }

    @PostMapping("/refresh")
    public ResponseEntity<CommonResponse<RefreshResponse>> refresh(@RequestBody RefreshRequest req) {

        Long userId = tokenService.validateRefreshToken(req.getRefreshToken());

        if (userId == null) {
            throw new InvalidRefreshTokenException("Refresh token is invalid or expired");
        }

        return ResponseEntity.ok(CommonResponse.success(tokenService.newAccessToken(userId)));
    }

    @PostMapping("/logout")
    public CommonResponse<String> logout(@RequestBody RefreshRequest req) {
        tokenService.revokeRefreshToken(req.getRefreshToken());
        return CommonResponse.success("Logged out");
    }
}
