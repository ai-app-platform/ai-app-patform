package com.aibuilder.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "agent_versions")
public class AgentVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

    @Column(nullable = false, length = 20)
    private String version;

    @Column(name = "role_version", length = 20)
    private String roleVersion;

    @Column(name = "prompt_version", columnDefinition = "jsonb")
    private String promptVersion;

    @Column(name = "skill_versions", columnDefinition = "jsonb")
    private String skillVersions;

    @Column(name = "tool_versions", columnDefinition = "jsonb")
    private String toolVersions;

    @Column(name = "snapshot", columnDefinition = "jsonb")
    private String snapshot;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public AgentVersion() {}

    public AgentVersion(Agent agent, String version) {
        this.agent = agent;
        this.version = version;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Agent getAgent() { return agent; }
    public void setAgent(Agent agent) { this.agent = agent; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getRoleVersion() { return roleVersion; }
    public void setRoleVersion(String roleVersion) { this.roleVersion = roleVersion; }

    public String getPromptVersion() { return promptVersion; }
    public void setPromptVersion(String promptVersion) { this.promptVersion = promptVersion; }

    public String getSkillVersions() { return skillVersions; }
    public void setSkillVersions(String skillVersions) { this.skillVersions = skillVersions; }

    public String getToolVersions() { return toolVersions; }
    public void setToolVersions(String toolVersions) { this.toolVersions = toolVersions; }

    public String getSnapshot() { return snapshot; }
    public void setSnapshot(String snapshot) { this.snapshot = snapshot; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
