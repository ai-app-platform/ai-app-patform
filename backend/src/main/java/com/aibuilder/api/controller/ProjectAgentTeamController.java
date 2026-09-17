package com.aibuilder.api.controller;

import com.aibuilder.application.dto.ProjectAgentTeamResponse;
import com.aibuilder.application.service.ProjectAgentTeamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/team")
public class ProjectAgentTeamController {

    private final ProjectAgentTeamService teamService;

    public ProjectAgentTeamController(ProjectAgentTeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping("/{agentId}")
    public ResponseEntity<ProjectAgentTeamResponse> addAgentToTeam(
            @PathVariable UUID projectId,
            @PathVariable UUID agentId) {
        ProjectAgentTeamResponse response = teamService.addAgentToTeam(projectId, agentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectAgentTeamResponse>> getProjectTeam(@PathVariable UUID projectId) {
        List<ProjectAgentTeamResponse> team = teamService.getProjectTeam(projectId);
        return ResponseEntity.ok(team);
    }

    @GetMapping("/enabled")
    public ResponseEntity<List<ProjectAgentTeamResponse>> getEnabledTeam(@PathVariable UUID projectId) {
        List<ProjectAgentTeamResponse> team = teamService.getEnabledProjectTeam(projectId);
        return ResponseEntity.ok(team);
    }

    @PostMapping("/{agentId}/enable")
    public ResponseEntity<ProjectAgentTeamResponse> enableAgent(
            @PathVariable UUID projectId,
            @PathVariable UUID agentId) {
        ProjectAgentTeamResponse response = teamService.enableAgent(projectId, agentId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{agentId}/disable")
    public ResponseEntity<ProjectAgentTeamResponse> disableAgent(
            @PathVariable UUID projectId,
            @PathVariable UUID agentId) {
        ProjectAgentTeamResponse response = teamService.disableAgent(projectId, agentId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{agentId}")
    public ResponseEntity<Void> removeAgentFromTeam(
            @PathVariable UUID projectId,
            @PathVariable UUID agentId) {
        teamService.removeAgentFromTeam(projectId, agentId);
        return ResponseEntity.noContent().build();
    }
}
