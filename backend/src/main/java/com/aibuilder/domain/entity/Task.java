package com.aibuilder.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "requirement_text", columnDefinition = "TEXT")
    private String requirementText;

    @Column(name = "plan", columnDefinition = "jsonb")
    private String plan;

    @Column(name = "execution_graph", columnDefinition = "jsonb")
    private String executionGraph;

    @Column(name = "selected_agents", columnDefinition = "jsonb")
    private String selectedAgents;

    @Column(name = "execution_state", columnDefinition = "jsonb")
    private String executionState;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @Column(name = "selection_mode", length = 20)
    @Enumerated(EnumType.STRING)
    private AgentSelectionMode selectionMode;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = TaskStatus.PENDING;
        }
        if (selectionMode == null) {
            selectionMode = AgentSelectionMode.AUTOMATIC;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Task() {}

    public Task(Project project, String title, String description) {
        this.project = project;
        this.title = title;
        this.description = description;
        this.status = TaskStatus.PENDING;
        this.selectionMode = AgentSelectionMode.AUTOMATIC;
    }

    public void start() {
        if (this.status != TaskStatus.PENDING) {
            throw new IllegalStateException("Only pending tasks can be started");
        }
        this.status = TaskStatus.RUNNING;
        this.startedAt = LocalDateTime.now();
    }

    public void complete() {
        if (this.status != TaskStatus.RUNNING) {
            throw new IllegalStateException("Only running tasks can be completed");
        }
        this.status = TaskStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }

    public void fail() {
        this.status = TaskStatus.FAILED;
        this.completedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequirementText() { return requirementText; }
    public void setRequirementText(String requirementText) { this.requirementText = requirementText; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public String getExecutionGraph() { return executionGraph; }
    public void setExecutionGraph(String executionGraph) { this.executionGraph = executionGraph; }

    public String getSelectedAgents() { return selectedAgents; }
    public void setSelectedAgents(String selectedAgents) { this.selectedAgents = selectedAgents; }

    public String getExecutionState() { return executionState; }
    public void setExecutionState(String executionState) { this.executionState = executionState; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public AgentSelectionMode getSelectionMode() { return selectionMode; }
    public void setSelectionMode(AgentSelectionMode selectionMode) { this.selectionMode = selectionMode; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
}
