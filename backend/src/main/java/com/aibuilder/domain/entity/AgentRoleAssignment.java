package com.aibuilder.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "agent_role_assignments")
public class AgentRoleAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_version_id")
    private RoleVersion roleVersion;

    @Column(nullable = false)
    private boolean primaryRole;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public AgentRoleAssignment() {}

    public AgentRoleAssignment(Agent agent, Role role, boolean primaryRole) {
        this.agent = agent;
        this.role = role;
        this.primaryRole = primaryRole;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Agent getAgent() { return agent; }
    public void setAgent(Agent agent) { this.agent = agent; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public RoleVersion getRoleVersion() { return roleVersion; }
    public void setRoleVersion(RoleVersion roleVersion) { this.roleVersion = roleVersion; }

    public boolean isPrimaryRole() { return primaryRole; }
    public void setPrimaryRole(boolean primaryRole) { this.primaryRole = primaryRole; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
