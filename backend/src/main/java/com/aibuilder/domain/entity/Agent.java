package com.aibuilder.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "agents")
public class Agent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "display_name", nullable = false, length = 200)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(name = "model_config", columnDefinition = "jsonb")
    private String modelConfig;

    @Column(name = "prompt_references", columnDefinition = "jsonb")
    private String promptReferences;

    @Column(name = "skill_references", columnDefinition = "jsonb")
    private String skillReferences;

    @Column(name = "tool_references", columnDefinition = "jsonb")
    private String toolReferences;

    @Column(name = "runtime_config", columnDefinition = "jsonb")
    private String runtimeConfig;

    @Column(name = "execution_policies", columnDefinition = "jsonb")
    private String executionPolicies;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private AgentStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = AgentStatus.DRAFT;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Agent() {}

    public Agent(String name, String displayName, String description, Role role) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.role = role;
        this.status = AgentStatus.DRAFT;
    }

    public void publish() {
        if (this.status == AgentStatus.DEPRECATED) {
            throw new IllegalStateException("Cannot publish a deprecated agent");
        }
        this.status = AgentStatus.PUBLISHED;
    }

    public void deprecate() {
        this.status = AgentStatus.DEPRECATED;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getModelConfig() { return modelConfig; }
    public void setModelConfig(String modelConfig) { this.modelConfig = modelConfig; }

    public String getPromptReferences() { return promptReferences; }
    public void setPromptReferences(String promptReferences) { this.promptReferences = promptReferences; }

    public String getSkillReferences() { return skillReferences; }
    public void setSkillReferences(String skillReferences) { this.skillReferences = skillReferences; }

    public String getToolReferences() { return toolReferences; }
    public void setToolReferences(String toolReferences) { this.toolReferences = toolReferences; }

    public String getRuntimeConfig() { return runtimeConfig; }
    public void setRuntimeConfig(String runtimeConfig) { this.runtimeConfig = runtimeConfig; }

    public String getExecutionPolicies() { return executionPolicies; }
    public void setExecutionPolicies(String executionPolicies) { this.executionPolicies = executionPolicies; }

    public AgentStatus getStatus() { return status; }
    public void setStatus(AgentStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
