package com.aibuilder.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProjectAgentTeamResponse(
    UUID id,
    UUID projectId,
    UUID agentId,
    String agentName,
    String agentDisplayName,
    String agentVersion,
    String roleName,
    boolean enabled,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
