package com.aibuilder.api.controller;

import com.aibuilder.application.dto.CreatePromptRequest;
import com.aibuilder.application.dto.PromptResponse;
import com.aibuilder.application.service.PromptService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/prompts")
public class PromptController {

    private final PromptService promptService;

    public PromptController(PromptService promptService) {
        this.promptService = promptService;
    }

    @PostMapping
    public ResponseEntity<PromptResponse> createPrompt(@Valid @RequestBody CreatePromptRequest request) {
        PromptResponse response = promptService.createPrompt(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<PromptResponse>> getAllPrompts(@PageableDefault(size = 20) Pageable pageable) {
        Page<PromptResponse> prompts = promptService.getAllPrompts(pageable);
        return ResponseEntity.ok(prompts);
    }

    @GetMapping("/{promptId}")
    public ResponseEntity<PromptResponse> getPrompt(@PathVariable UUID promptId) {
        PromptResponse response = promptService.getPrompt(promptId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{promptId}/activate")
    public ResponseEntity<PromptResponse> activatePrompt(@PathVariable UUID promptId) {
        PromptResponse response = promptService.activatePrompt(promptId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{promptId}/deprecate")
    public ResponseEntity<PromptResponse> deprecatePrompt(@PathVariable UUID promptId) {
        PromptResponse response = promptService.deprecatePrompt(promptId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{promptId}")
    public ResponseEntity<Void> deletePrompt(@PathVariable UUID promptId) {
        promptService.deletePrompt(promptId);
        return ResponseEntity.noContent().build();
    }
}
