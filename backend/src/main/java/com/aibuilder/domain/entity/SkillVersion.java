package com.aibuilder.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "skill_versions")
public class SkillVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false, length = 20)
    private String version;

    @Column(name = "definition", columnDefinition = "jsonb")
    private String definition;

    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "examples", columnDefinition = "jsonb")
    private String examples;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public SkillVersion() {}

    public SkillVersion(Skill skill, String version) {
        this.skill = skill;
        this.version = version;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getDefinition() { return definition; }
    public void setDefinition(String definition) { this.definition = definition; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getExamples() { return examples; }
    public void setExamples(String examples) { this.examples = examples; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
