package com.aibuilder.application.dto;

import java.util.UUID;

public record AuthResponse(
    String token,
    String tokenType,
    UUID userId,
    String fullName,
    String email,
    String role
) {
    public AuthResponse(String token, UUID userId, String fullName, String email, String role) {
        this(token, "Bearer", userId, fullName, email, role);
    }
}
