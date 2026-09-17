package com.aibuilder.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ToolResponse(
    UUID id,
    String name,
    String displayName,
    String description,
    String type,
    String status,
    boolean enabled,
    String version,
    String inputSchema,
    String outputSchema,
    String executionConfig,
    Integer timeoutMs,
    Integer retryCount,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
