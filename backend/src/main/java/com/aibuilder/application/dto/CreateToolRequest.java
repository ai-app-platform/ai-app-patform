package com.aibuilder.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateToolRequest(
    @NotBlank(message = "Tool name is required")
    @Size(min = 2, max = 100, message = "Tool name must be between 2 and 100 characters")
    String name,

    @NotBlank(message = "Display name is required")
    @Size(min = 2, max = 200, message = "Display name must be between 2 and 200 characters")
    String displayName,

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    String description,

    String type,
    String inputSchema,
    String outputSchema,
    String executionConfig,
    String authenticationConfig,
    Integer timeoutMs,
    Integer retryCount
) {}
