package com.aibuilder.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "agent_skill_assignments")
public class AgentSkillAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_version_id")
    private SkillVersion skillVersion;

    @Column(name = "proficiency_level", length = 20)
    @Enumerated(EnumType.STRING)
    private ProficiencyLevel proficiencyLevel;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public AgentSkillAssignment() {}

    public AgentSkillAssignment(Agent agent, Skill skill) {
        this.agent = agent;
        this.skill = skill;
        this.proficiencyLevel = ProficiencyLevel.PROFICIENT;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Agent getAgent() { return agent; }
    public void setAgent(Agent agent) { this.agent = agent; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public SkillVersion getSkillVersion() { return skillVersion; }
    public void setSkillVersion(SkillVersion skillVersion) { this.skillVersion = skillVersion; }

    public ProficiencyLevel getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
