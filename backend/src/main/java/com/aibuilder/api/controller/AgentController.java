package com.aibuilder.api.controller;

import com.aibuilder.application.dto.AgentResponse;
import com.aibuilder.application.dto.CreateAgentRequest;
import com.aibuilder.application.service.AgentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/agents")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping
    public ResponseEntity<AgentResponse> createAgent(@Valid @RequestBody CreateAgentRequest request) {
        AgentResponse response = agentService.createAgent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<AgentResponse>> getAllAgents(@PageableDefault(size = 20) Pageable pageable) {
        Page<AgentResponse> agents = agentService.getAllAgents(pageable);
        return ResponseEntity.ok(agents);
    }

    @GetMapping("/{agentId}")
    public ResponseEntity<AgentResponse> getAgent(@PathVariable UUID agentId) {
        AgentResponse response = agentService.getAgent(agentId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{agentId}/publish")
    public ResponseEntity<AgentResponse> publishAgent(@PathVariable UUID agentId) {
        AgentResponse response = agentService.publishAgent(agentId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{agentId}/deprecate")
    public ResponseEntity<AgentResponse> deprecateAgent(@PathVariable UUID agentId) {
        AgentResponse response = agentService.deprecateAgent(agentId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{agentId}")
    public ResponseEntity<Void> deleteAgent(@PathVariable UUID agentId) {
        agentService.deleteAgent(agentId);
        return ResponseEntity.noContent().build();
    }
}
