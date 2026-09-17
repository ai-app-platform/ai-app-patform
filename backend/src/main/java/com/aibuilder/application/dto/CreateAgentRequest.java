package com.aibuilder.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateAgentRequest(
    @NotBlank(message = "Agent name is required")
    @Size(min = 2, max = 100, message = "Agent name must be between 2 and 100 characters")
    String name,

    @NotBlank(message = "Display name is required")
    @Size(min = 2, max = 200, message = "Display name must be between 2 and 200 characters")
    String displayName,

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    String description,

    String roleName,
    String modelConfig,
    String promptReferences,
    String skillReferences,
    String toolReferences,
    String runtimeConfig,
    String executionPolicies
) {}
