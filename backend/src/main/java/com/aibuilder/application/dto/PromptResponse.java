package com.aibuilder.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record PromptResponse(
    UUID id,
    String name,
    String displayName,
    String description,
    String scope,
    String status,
    String version,
    String template,
    String variables,
    String modelConfig,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
