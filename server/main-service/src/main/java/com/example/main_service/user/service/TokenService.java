package com.example.main_service.user.service;

import com.example.main_service.user.dto.RefreshResponse;

public interface TokenService {
    public Long validateRefreshToken(String token);
    public RefreshResponse newAccessToken(Long userId);
    public String createRefreshToken(Long userId, String ipAddr);
    public void revokeRefreshToken(String token);
    public Long getAccessTokenExpiry();
}
