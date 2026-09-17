package com.aibuilder.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "role_versions")
public class RoleVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(nullable = false, length = 20)
    private String version;

    @Column(name = "responsibilities", columnDefinition = "jsonb")
    private String responsibilities;

    @Column(name = "constraints", columnDefinition = "jsonb")
    private String constraints;

    @Column(name = "required_skills", columnDefinition = "jsonb")
    private String requiredSkills;

    @Column(name = "preferred_skills", columnDefinition = "jsonb")
    private String preferredSkills;

    @Column(name = "tool_capabilities", columnDefinition = "jsonb")
    private String toolCapabilities;

    @Column(name = "prompt_refs", columnDefinition = "jsonb")
    private String promptRefs;

    @Column(name = "expected_outputs", columnDefinition = "jsonb")
    private String expectedOutputs;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public RoleVersion() {}

    public RoleVersion(Role role, String version) {
        this.role = role;
        this.version = version;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getResponsibilities() { return responsibilities; }
    public void setResponsibilities(String responsibilities) { this.responsibilities = responsibilities; }

    public String getConstraints() { return constraints; }
    public void setConstraints(String constraints) { this.constraints = constraints; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getPreferredSkills() { return preferredSkills; }
    public void setPreferredSkills(String preferredSkills) { this.preferredSkills = preferredSkills; }

    public String getToolCapabilities() { return toolCapabilities; }
    public void setToolCapabilities(String toolCapabilities) { this.toolCapabilities = toolCapabilities; }

    public String getPromptRefs() { return promptRefs; }
    public void setPromptRefs(String promptRefs) { this.promptRefs = promptRefs; }

    public String getExpectedOutputs() { return expectedOutputs; }
    public void setExpectedOutputs(String expectedOutputs) { this.expectedOutputs = expectedOutputs; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
