package com.example.main_service.user.controller;

import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.sharedAttribute.exceptions.specException.InvalidRefreshTokenException;
import com.example.main_service.user.dto.*;
import com.example.main_service.user.service.AuthService;
import com.example.main_service.user.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// access token có dễ bị lộ k ? (hiện tại đang đặt full niềm tin vào access token (chứa user id))

// to do : handle exception ở login/register (chặn kí tự lạ blah blah)

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;

    public AuthController(AuthService authService, TokenService tokenService) {
        this.authService = authService;
        this.tokenService = tokenService;
    }

    @PostMapping("/register")
    public CommonResponse<RegisterResponse> register(@RequestBody RegisterRequest req) {
        Long userId = authService.register(req);
        RegisterResponse response =  new RegisterResponse(
                userId, req.getUserName(), req.getEmail()
        );
        return CommonResponse.success(response);
    }

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

    @PostMapping("/refresh")
    public ResponseEntity<CommonResponse<RefreshResponse>> refresh(@RequestBody RefreshRequest req) {

        Long userId = tokenService.validateRefreshToken(req.getRefreshToken());

        if (userId == null) {
            throw new InvalidRefreshTokenException("Refresh token is invalid or expired");
        }

        String newAccessToken = tokenService.newAccessToken(userId);

        RefreshResponse res = new RefreshResponse(
                newAccessToken,
                tokenService.getAccessTokenExpiry()
        );

        return ResponseEntity.ok(CommonResponse.success(res));
    }

    @PostMapping("/logout")
    public CommonResponse<String> logout(@RequestBody RefreshRequest req) {
        tokenService.revokeRefreshToken(req.getRefreshToken());
        return CommonResponse.success("Logged out");
    }
}
