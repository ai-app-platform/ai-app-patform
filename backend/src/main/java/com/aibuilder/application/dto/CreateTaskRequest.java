package com.aibuilder.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTaskRequest(
    @NotBlank(message = "Task title is required")
    @Size(min = 2, max = 200, message = "Task title must be between 2 and 200 characters")
    String title,

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    String description,

    String requirementText,

    String selectionMode
) {}
