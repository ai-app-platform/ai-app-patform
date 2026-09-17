package com.aibuilder.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tools")
public class Tool {

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
    private ToolType type;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ToolStatus status;

    @Column(nullable = false)
    private boolean enabled;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = ToolStatus.DRAFT;
        }
        enabled = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public Tool() {}

    public Tool(String name, String displayName, String description, ToolType type) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.type = type;
        this.status = ToolStatus.DRAFT;
        this.enabled = true;
    }

    // Business Methods
    public void activate() {
        if (this.status == ToolStatus.DEPRECATED) {
            throw new IllegalStateException("Cannot activate a deprecated tool");
        }
        this.status = ToolStatus.ACTIVE;
        this.enabled = true;
    }

    public void disable() {
        this.enabled = false;
        this.status = ToolStatus.DISABLED;
    }

    public void deprecate() {
        this.status = ToolStatus.DEPRECATED;
        this.enabled = false;
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

    public ToolType getType() { return type; }
    public void setType(ToolType type) { this.type = type; }

    public ToolStatus getStatus() { return status; }
    public void setStatus(ToolStatus status) { this.status = status; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
