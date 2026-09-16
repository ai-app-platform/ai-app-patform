package com.aibuilder.api.controller;

import com.aibuilder.application.dto.CreateProjectRequest;
import com.aibuilder.application.dto.ProjectResponse;
import com.aibuilder.application.service.ProjectService;
import com.aibuilder.domain.entity.ProjectStatus;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @RequestAttribute("userId") UUID userId,
            @Valid @RequestBody CreateProjectRequest request) {
        ProjectResponse response = projectService.createProject(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> getUserProjects(
            @RequestAttribute("userId") UUID userId,
            @RequestParam(required = false) ProjectStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ProjectResponse> projects = projectService.getUserProjects(userId, status, pageable);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable UUID projectId,
            @RequestAttribute("userId") UUID userId) {
        ProjectResponse response = projectService.getProject(projectId, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable UUID projectId,
            @RequestAttribute("userId") UUID userId) {
        projectService.deleteProject(projectId, userId);
        return ResponseEntity.noContent().build();
    }
}
