package com.aibuilder.application.service;

import com.aibuilder.application.dto.CreatePromptRequest;
import com.aibuilder.application.dto.PromptResponse;
import com.aibuilder.domain.entity.Prompt;
import com.aibuilder.domain.entity.PromptScope;
import com.aibuilder.domain.entity.PromptStatus;
import com.aibuilder.domain.entity.PromptVersion;
import com.aibuilder.domain.exception.BusinessException;
import com.aibuilder.domain.exception.ResourceNotFoundException;
import com.aibuilder.domain.repository.PromptRepository;
import com.aibuilder.domain.repository.PromptVersionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PromptService {

    private final PromptRepository promptRepository;
    private final PromptVersionRepository promptVersionRepository;

    public PromptService(PromptRepository promptRepository, PromptVersionRepository promptVersionRepository) {
        this.promptRepository = promptRepository;
        this.promptVersionRepository = promptVersionRepository;
    }

    @Transactional
    public PromptResponse createPrompt(CreatePromptRequest request) {
        if (promptRepository.existsByName(request.name())) {
            throw new BusinessException("PROMPT_NAME_EXISTS", "A prompt with this name already exists");
        }

        PromptScope scope = request.scope() != null ? PromptScope.valueOf(request.scope()) : PromptScope.PLATFORM;
        Prompt prompt = new Prompt(request.name(), request.displayName(), request.description(), scope);
        prompt.setVariables(request.variables());

        Prompt savedPrompt = promptRepository.save(prompt);

        // Create initial version
        String template = request.template() != null ? request.template() : "";
        PromptVersion version = new PromptVersion(savedPrompt, "v1.0.0", template);
        version.setModelConfig(request.modelConfig());
        promptVersionRepository.save(version);

        return toResponse(savedPrompt, version);
    }

    @Transactional(readOnly = true)
    public Page<PromptResponse> getAllPrompts(Pageable pageable) {
        return promptRepository.findAll(pageable).map(prompt -> {
            PromptVersion latestVersion = promptVersionRepository.findByPromptOrderByCreatedAtDesc(prompt)
                .stream()
                .findFirst()
                .orElse(null);
            return toResponse(prompt, latestVersion);
        });
    }

    @Transactional(readOnly = true)
    public PromptResponse getPrompt(UUID promptId) {
        Prompt prompt = promptRepository.findById(promptId)
            .orElseThrow(() -> new ResourceNotFoundException("Prompt", "id", promptId));

        PromptVersion latestVersion = promptVersionRepository.findByPromptOrderByCreatedAtDesc(prompt)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(prompt, latestVersion);
    }

    @Transactional
    public PromptResponse activatePrompt(UUID promptId) {
        Prompt prompt = promptRepository.findById(promptId)
            .orElseThrow(() -> new ResourceNotFoundException("Prompt", "id", promptId));

        prompt.activate();
        Prompt savedPrompt = promptRepository.save(prompt);

        PromptVersion latestVersion = promptVersionRepository.findByPromptOrderByCreatedAtDesc(prompt)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(savedPrompt, latestVersion);
    }

    @Transactional
    public PromptResponse deprecatePrompt(UUID promptId) {
        Prompt prompt = promptRepository.findById(promptId)
            .orElseThrow(() -> new ResourceNotFoundException("Prompt", "id", promptId));

        prompt.deprecate();
        Prompt savedPrompt = promptRepository.save(prompt);

        PromptVersion latestVersion = promptVersionRepository.findByPromptOrderByCreatedAtDesc(prompt)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(savedPrompt, latestVersion);
    }

    @Transactional
    public void deletePrompt(UUID promptId) {
        Prompt prompt = promptRepository.findById(promptId)
            .orElseThrow(() -> new ResourceNotFoundException("Prompt", "id", promptId));

        if (prompt.getStatus() == PromptStatus.ACTIVE) {
            throw new BusinessException("PROMPT_ACTIVE", "Cannot delete an active prompt. Deprecate it first.");
        }

        promptRepository.delete(prompt);
    }

    private PromptResponse toResponse(Prompt prompt, PromptVersion version) {
        return new PromptResponse(
            prompt.getId(),
            prompt.getName(),
            prompt.getDisplayName(),
            prompt.getDescription(),
            prompt.getScope().name(),
            prompt.getStatus().name(),
            version != null ? version.getVersion() : null,
            version != null ? version.getTemplate() : null,
            prompt.getVariables(),
            version != null ? version.getModelConfig() : null,
            prompt.getCreatedAt(),
            prompt.getUpdatedAt()
        );
    }
}
