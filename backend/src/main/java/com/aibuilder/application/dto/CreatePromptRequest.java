package com.aibuilder.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePromptRequest(
    @NotBlank(message = "Prompt name is required")
    @Size(min = 2, max = 100)
    String name,

    @NotBlank(message = "Display name is required")
    @Size(min = 2, max = 200)
    String displayName,

    @Size(max = 2000)
    String description,

    String scope,
    String template,
    String variables,
    String modelConfig
) {}
