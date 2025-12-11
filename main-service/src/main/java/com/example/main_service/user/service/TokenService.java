package com.example.main_service.user.service;

import com.example.main_service.user.model.RefreshTokenEntity;
import com.example.main_service.user.repo.RefreshTokenRepo;
import com.example.main_service.user.security.JwtAccessTokenProvider;
import com.example.main_service.user.security.JwtRefreshTokenProvider;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class TokenService {

    private final JwtAccessTokenProvider accessProvider;
    private final JwtRefreshTokenProvider refreshProvider;
    private final RefreshTokenRepo refreshTokenRepo;

    public TokenService(JwtAccessTokenProvider accessProvider,
                        JwtRefreshTokenProvider refreshProvider,
                        RefreshTokenRepo refreshTokenRepo) {
        this.accessProvider = accessProvider;
        this.refreshProvider = refreshProvider;
        this.refreshTokenRepo = refreshTokenRepo;
    }

    public Long validateRefreshToken(String token) {
        try {
            Long userId = Jwts.parser()
                    .setSigningKey(refreshProvider.getSecretKey())
                    .parseClaimsJws(token)
                    .getBody()
                    .get("userId", Long.class);

            RefreshTokenEntity entity = refreshTokenRepo.findByRefreshToken(token)
                    .orElse(null);

            if (entity == null) return null;
            if (entity.isRevoked()) return null;
            if (entity.getExpiredAt().isBefore(LocalDateTime.now())) return null;

            return userId;

        } catch (Exception e) {
            return null;
        }

    }

    public String newAccessToken(Long userId) {
        return accessProvider.generate(userId);
    }

    public String createRefreshToken(Long userId, String ipAddr) {
        String token = refreshProvider.generate(userId);

        RefreshTokenEntity entity = new RefreshTokenEntity();
        entity.setUserId(userId);
        entity.setRefreshToken(token);
        entity.setIssuedAt(LocalDateTime.now());
        entity.setExpiredAt(LocalDateTime.now().plusDays(7)); // 7 ngày
        entity.setRevoked(false);
        entity.setIpAddr(ipAddr);

        refreshTokenRepo.save(entity);

        return token;
    }
    public void revokeRefreshToken(String token) {
        Optional<RefreshTokenEntity> tokenEntityOpt = refreshTokenRepo.findByRefreshToken(token);
        tokenEntityOpt.ifPresent(tokenEntity -> {
            tokenEntity.setRevoked(true);
            refreshTokenRepo.save(tokenEntity);
        });
    }
    public Long getAccessTokenExpiry() {
        return accessProvider.getExpireMs();
    }
}
