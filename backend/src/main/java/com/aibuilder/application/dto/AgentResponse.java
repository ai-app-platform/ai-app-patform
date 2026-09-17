package com.aibuilder.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AgentResponse(
    UUID id,
    String name,
    String displayName,
    String description,
    String roleName,
    String roleDisplayName,
    String status,
    String version,
    String modelConfig,
    String promptReferences,
    String skillReferences,
    String toolReferences,
    String runtimeConfig,
    String executionPolicies,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
