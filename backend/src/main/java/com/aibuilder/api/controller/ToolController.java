package com.aibuilder.api.controller;

import com.aibuilder.application.dto.CreateToolRequest;
import com.aibuilder.application.dto.ToolResponse;
import com.aibuilder.application.service.ToolService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tools")
public class ToolController {

    private final ToolService toolService;

    public ToolController(ToolService toolService) {
        this.toolService = toolService;
    }

    @PostMapping
    public ResponseEntity<ToolResponse> createTool(@Valid @RequestBody CreateToolRequest request) {
        ToolResponse response = toolService.createTool(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ToolResponse>> getAllTools(@PageableDefault(size = 20) Pageable pageable) {
        Page<ToolResponse> tools = toolService.getAllTools(pageable);
        return ResponseEntity.ok(tools);
    }

    @GetMapping("/{toolId}")
    public ResponseEntity<ToolResponse> getTool(@PathVariable UUID toolId) {
        ToolResponse response = toolService.getTool(toolId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{toolId}/activate")
    public ResponseEntity<ToolResponse> activateTool(@PathVariable UUID toolId) {
        ToolResponse response = toolService.activateTool(toolId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{toolId}/disable")
    public ResponseEntity<ToolResponse> disableTool(@PathVariable UUID toolId) {
        ToolResponse response = toolService.disableTool(toolId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{toolId}")
    public ResponseEntity<Void> deleteTool(@PathVariable UUID toolId) {
        toolService.deleteTool(toolId);
        return ResponseEntity.noContent().build();
    }
}
