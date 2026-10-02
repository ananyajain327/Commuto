package Commuto.Backend.security;

import Commuto.Backend.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationTime;

    public JwtService(
        @Value("${app.jwt.secret}") String secret,
        @Value("${app.jwt.expiration-ms}") long expirationTime) {
    byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
    if (secretBytes.length < 32) {
        throw new IllegalStateException("JWT_SECRET must contain at least 32 bytes");
    }
    this.signingKey = Keys.hmacShaKeyFor(secretBytes);
    this.expirationTime = expirationTime;
    }

    public String generateToken(User user) {

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole().name())
                .claim("userId", user.getId())
                .issuedAt(new Date())
                .expiration(
                    new Date(System.currentTimeMillis() + expirationTime)
                )
                .signWith(signingKey)
                .compact();
    }

    public String extractEmail(String token) {

        return Jwts.parser()
            .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean isTokenValid(String token, User user) {

        try {
            String email = extractEmail(token);

            return email.equals(user.getEmail());

        } catch (Exception e) {
            return false;
        }
    }
}