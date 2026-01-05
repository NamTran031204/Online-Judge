package com.example.main_service.user.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtRefreshTokenProvider {

    private final SecretKey key;
    public JwtRefreshTokenProvider(@Value("${jwt.refresh.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }
    private final long EXPIRE_MS = 7 * 24 * 60 * 60 * 1000; // 7 ngày

    public String generate(Long userId) {
        return Jwts.builder()
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_MS))
                .signWith(SignatureAlgorithm.HS256, key)
                .compact();
    }
    public SecretKey getSecretKey() {
        return this.key;
    }
}
