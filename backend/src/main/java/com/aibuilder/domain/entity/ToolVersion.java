package com.aibuilder.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tool_versions")
public class ToolVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tool_id", nullable = false)
    private Tool tool;

    @Column(nullable = false, length = 20)
    private String version;

    @Column(name = "input_schema", columnDefinition = "jsonb")
    private String inputSchema;

    @Column(name = "output_schema", columnDefinition = "jsonb")
    private String outputSchema;

    @Column(name = "execution_config", columnDefinition = "jsonb")
    private String executionConfig;

    @Column(name = "authentication_config", columnDefinition = "jsonb")
    private String authenticationConfig;

    @Column(name = "timeout_ms")
    private Integer timeoutMs;

    @Column(name = "retry_count")
    private Integer retryCount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors
    public ToolVersion() {}

    public ToolVersion(Tool tool, String version) {
        this.tool = tool;
        this.version = version;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Tool getTool() { return tool; }
    public void setTool(Tool tool) { this.tool = tool; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getInputSchema() { return inputSchema; }
    public void setInputSchema(String inputSchema) { this.inputSchema = inputSchema; }

    public String getOutputSchema() { return outputSchema; }
    public void setOutputSchema(String outputSchema) { this.outputSchema = outputSchema; }

    public String getExecutionConfig() { return executionConfig; }
    public void setExecutionConfig(String executionConfig) { this.executionConfig = executionConfig; }

    public String getAuthenticationConfig() { return authenticationConfig; }
    public void setAuthenticationConfig(String authenticationConfig) { this.authenticationConfig = authenticationConfig; }

    public Integer getTimeoutMs() { return timeoutMs; }
    public void setTimeoutMs(Integer timeoutMs) { this.timeoutMs = timeoutMs; }

    public Integer getRetryCount() { return retryCount; }
    public void setRetryCount(Integer retryCount) { this.retryCount = retryCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
