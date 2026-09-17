package com.aibuilder.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "display_name", nullable = false, length = 200)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "dependencies", columnDefinition = "jsonb")
    private String dependencies;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private SkillStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = SkillStatus.DRAFT;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Skill() {}

    public Skill(String name, String displayName, String description) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.status = SkillStatus.DRAFT;
    }

    public void activate() {
        this.status = SkillStatus.ACTIVE;
    }

    public void deprecate() {
        this.status = SkillStatus.DEPRECATED;
    }

    public void disable() {
        this.status = SkillStatus.DISABLED;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDependencies() { return dependencies; }
    public void setDependencies(String dependencies) { this.dependencies = dependencies; }

    public SkillStatus getStatus() { return status; }
    public void setStatus(SkillStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
