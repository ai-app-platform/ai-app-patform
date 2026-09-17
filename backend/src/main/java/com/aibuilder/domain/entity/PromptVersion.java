package com.aibuilder.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "prompt_versions")
public class PromptVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_id", nullable = false)
    private Prompt prompt;

    @Column(nullable = false, length = 20)
    private String version;

    @Column(name = "template", columnDefinition = "TEXT", nullable = false)
    private String template;

    @Column(name = "variable_metadata", columnDefinition = "jsonb")
    private String variableMetadata;

    @Column(name = "model_config", columnDefinition = "jsonb")
    private String modelConfig;

    @Column(name = "composition_refs", columnDefinition = "jsonb")
    private String compositionRefs;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public PromptVersion() {}

    public PromptVersion(Prompt prompt, String version, String template) {
        this.prompt = prompt;
        this.version = version;
        this.template = template;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Prompt getPrompt() { return prompt; }
    public void setPrompt(Prompt prompt) { this.prompt = prompt; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getTemplate() { return template; }
    public void setTemplate(String template) { this.template = template; }

    public String getVariableMetadata() { return variableMetadata; }
    public void setVariableMetadata(String variableMetadata) { this.variableMetadata = variableMetadata; }

    public String getModelConfig() { return modelConfig; }
    public void setModelConfig(String modelConfig) { this.modelConfig = modelConfig; }

    public String getCompositionRefs() { return compositionRefs; }
    public void setCompositionRefs(String compositionRefs) { this.compositionRefs = compositionRefs; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
