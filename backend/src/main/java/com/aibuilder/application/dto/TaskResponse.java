package com.aibuilder.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record TaskResponse(
    UUID id,
    UUID projectId,
    String title,
    String description,
    String requirementText,
    String plan,
    String executionGraph,
    String selectedAgents,
    String executionState,
    String status,
    String selectionMode,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime startedAt,
    LocalDateTime completedAt
) {}
