package com.aibuilder.application.dto;

import java.time.LocalDateTime;

public record ErrorResponse(
    int status,
    String error,
    String message,
    String errorCode,
    LocalDateTime timestamp
) {
    public ErrorResponse(int status, String error, String message, String errorCode) {
        this(status, error, message, errorCode, LocalDateTime.now());
    }
}
