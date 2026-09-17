package com.aibuilder.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateSkillRequest(
    @NotBlank(message = "Skill name is required")
    @Size(min = 2, max = 100)
    String name,

    @NotBlank(message = "Display name is required")
    @Size(min = 2, max = 200)
    String displayName,

    @Size(max = 2000)
    String description,

    String category,
    String dependencies,
    String definition,
    String instructions
) {}
