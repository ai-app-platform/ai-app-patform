package com.aibuilder.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "prompts")
public class Prompt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "display_name", nullable = false, length = 200)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private PromptScope scope;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private PromptStatus status;

    @Column(name = "variables", columnDefinition = "jsonb")
    private String variables;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = PromptStatus.DRAFT;
        }
        if (scope == null) {
            scope = PromptScope.PLATFORM;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Prompt() {}

    public Prompt(String name, String displayName, String description, PromptScope scope) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.scope = scope;
        this.status = PromptStatus.DRAFT;
    }

    public void activate() {
        if (this.status == PromptStatus.DISABLED || this.status == PromptStatus.ARCHIVED) {
            throw new IllegalStateException("Cannot activate a disabled or archived prompt");
        }
        this.status = PromptStatus.ACTIVE;
    }

    public void deprecate() {
        this.status = PromptStatus.DEPRECATED;
    }

    public void disable() {
        this.status = PromptStatus.DISABLED;
    }

    public void archive() {
        this.status = PromptStatus.ARCHIVED;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public PromptScope getScope() { return scope; }
    public void setScope(PromptScope scope) { this.scope = scope; }

    public PromptStatus getStatus() { return status; }
    public void setStatus(PromptStatus status) { this.status = status; }

    public String getVariables() { return variables; }
    public void setVariables(String variables) { this.variables = variables; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
