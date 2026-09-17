package com.aibuilder.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record RoleResponse(
    UUID id,
    String name,
    String displayName,
    String description,
    String category,
    String status,
    String version,
    String responsibilities,
    String constraints,
    String requiredSkills,
    String preferredSkills,
    String toolCapabilities,
    String promptRefs,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
