package com.example.main_service.user.service;

import com.example.main_service.user.dto.LoginRequest;
import com.example.main_service.user.dto.LoginResponse;
import com.example.main_service.user.dto.RegisterRequest;
import com.example.main_service.user.model.UserEntity;
import com.example.main_service.user.repo.UserRepo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthService {

    private final UserRepo userRepo;
    private final TokenService tokenService;
    private final BCryptPasswordEncoder encoder;

    public AuthService(UserRepo userRepo,
                       TokenService tokenService) {
        this.userRepo = userRepo;
        this.tokenService = tokenService;
        this.encoder = new BCryptPasswordEncoder();
    }

    /**
     * Đăng ký user mới
     */
    public Long register(RegisterRequest req) {
        if (userRepo.findByUserName(req.getUserName()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        UserEntity u = new UserEntity();
        u.setUserName(req.getUserName());
        u.setEmail(req.getEmail());
        u.setPassword(encoder.encode(req.getPassword()));

        UserEntity saved = userRepo.save(u);
        return saved.getUserId();
    }

    /**
     * Login: trả về access token + refresh token
     */
    public LoginResponse login(LoginRequest req, String ipAddr) {
        log.info("====Inside login====={}",req.getUserName());

        UserEntity user = userRepo.findByUserName(req.getUserName())
                .orElseThrow(() -> new RuntimeException("Invalid user"));

        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Tạo access token
        String accessToken = tokenService.newAccessToken(user.getUserId());

        // Tạo refresh token và lưu DB
        String refreshToken = tokenService.createRefreshToken(user.getUserId(), ipAddr);

        LoginResponse res = new LoginResponse();
        res.setAccessToken(accessToken);
        res.setRefreshToken(refreshToken);
        res.setExpiresIn(tokenService.getAccessTokenExpiry());

        return res;
    }

    /**
     * Logout: revoke refresh token
     */
    public void logout(String refreshToken) {
        tokenService.revokeRefreshToken(refreshToken);
    }
}
