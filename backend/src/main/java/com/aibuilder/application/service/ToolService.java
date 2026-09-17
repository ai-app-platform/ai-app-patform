package com.aibuilder.application.service;

import com.aibuilder.application.dto.CreateToolRequest;
import com.aibuilder.application.dto.ToolResponse;
import com.aibuilder.domain.entity.Tool;
import com.aibuilder.domain.entity.ToolStatus;
import com.aibuilder.domain.entity.ToolType;
import com.aibuilder.domain.entity.ToolVersion;
import com.aibuilder.domain.exception.BusinessException;
import com.aibuilder.domain.exception.ResourceNotFoundException;
import com.aibuilder.domain.repository.ToolRepository;
import com.aibuilder.domain.repository.ToolVersionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ToolService {

    private final ToolRepository toolRepository;
    private final ToolVersionRepository toolVersionRepository;

    public ToolService(ToolRepository toolRepository, ToolVersionRepository toolVersionRepository) {
        this.toolRepository = toolRepository;
        this.toolVersionRepository = toolVersionRepository;
    }

    @Transactional
    public ToolResponse createTool(CreateToolRequest request) {
        if (toolRepository.existsByName(request.name())) {
            throw new BusinessException("TOOL_NAME_EXISTS",
                "A tool with this name already exists");
        }

        ToolType toolType = ToolType.valueOf(request.type() != null ? request.type() : "HTTP");
        Tool tool = new Tool(request.name(), request.displayName(), request.description(), toolType);
        Tool savedTool = toolRepository.save(tool);

        // Create initial version
        ToolVersion version = new ToolVersion(savedTool, "v1.0.0");
        version.setInputSchema(request.inputSchema());
        version.setOutputSchema(request.outputSchema());
        version.setExecutionConfig(request.executionConfig());
        version.setAuthenticationConfig(request.authenticationConfig());
        version.setTimeoutMs(request.timeoutMs() != null ? request.timeoutMs() : 10000);
        version.setRetryCount(request.retryCount() != null ? request.retryCount() : 2);
        toolVersionRepository.save(version);

        return toResponse(savedTool, version);
    }

    @Transactional(readOnly = true)
    public Page<ToolResponse> getAllTools(Pageable pageable) {
        return toolRepository.findAll(pageable).map(tool -> {
            ToolVersion latestVersion = toolVersionRepository.findByToolOrderByCreatedAtDesc(tool)
                .stream()
                .findFirst()
                .orElse(null);
            return toResponse(tool, latestVersion);
        });
    }

    @Transactional(readOnly = true)
    public ToolResponse getTool(UUID toolId) {
        Tool tool = toolRepository.findById(toolId)
            .orElseThrow(() -> new ResourceNotFoundException("Tool", "id", toolId));

        ToolVersion latestVersion = toolVersionRepository.findByToolOrderByCreatedAtDesc(tool)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(tool, latestVersion);
    }

    @Transactional
    public ToolResponse activateTool(UUID toolId) {
        Tool tool = toolRepository.findById(toolId)
            .orElseThrow(() -> new ResourceNotFoundException("Tool", "id", toolId));

        tool.activate();
        Tool savedTool = toolRepository.save(tool);

        ToolVersion latestVersion = toolVersionRepository.findByToolOrderByCreatedAtDesc(tool)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(savedTool, latestVersion);
    }

    @Transactional
    public ToolResponse disableTool(UUID toolId) {
        Tool tool = toolRepository.findById(toolId)
            .orElseThrow(() -> new ResourceNotFoundException("Tool", "id", toolId));

        tool.disable();
        Tool savedTool = toolRepository.save(tool);

        ToolVersion latestVersion = toolVersionRepository.findByToolOrderByCreatedAtDesc(tool)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(savedTool, latestVersion);
    }

    @Transactional
    public void deleteTool(UUID toolId) {
        Tool tool = toolRepository.findById(toolId)
            .orElseThrow(() -> new ResourceNotFoundException("Tool", "id", toolId));

        if (tool.getStatus() == ToolStatus.ACTIVE) {
            throw new BusinessException("TOOL_ACTIVE",
                "Cannot delete an active tool. Disable it first.");
        }

        toolRepository.delete(tool);
    }

    private ToolResponse toResponse(Tool tool, ToolVersion version) {
        return new ToolResponse(
            tool.getId(),
            tool.getName(),
            tool.getDisplayName(),
            tool.getDescription(),
            tool.getType().name(),
            tool.getStatus().name(),
            tool.isEnabled(),
            version != null ? version.getVersion() : null,
            version != null ? version.getInputSchema() : null,
            version != null ? version.getOutputSchema() : null,
            version != null ? version.getExecutionConfig() : null,
            version != null ? version.getTimeoutMs() : null,
            version != null ? version.getRetryCount() : null,
            tool.getCreatedAt(),
            tool.getUpdatedAt()
        );
    }
}
