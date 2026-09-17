package com.aibuilder.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record SkillResponse(
    UUID id,
    String name,
    String displayName,
    String description,
    String category,
    String status,
    String version,
    String dependencies,
    String definition,
    String instructions,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
