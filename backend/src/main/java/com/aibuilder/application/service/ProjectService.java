package com.aibuilder.application.service;

import com.aibuilder.application.dto.CreateProjectRequest;
import com.aibuilder.application.dto.ProjectResponse;
import com.aibuilder.domain.entity.Project;
import com.aibuilder.domain.entity.ProjectStatus;
import com.aibuilder.domain.entity.User;
import com.aibuilder.domain.exception.ResourceNotFoundException;
import com.aibuilder.domain.repository.ProjectRepository;
import com.aibuilder.domain.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ProjectResponse createProject(UUID userId, CreateProjectRequest request) {
        User owner = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Project project = new Project(request.name(), request.description(), owner);
        project.setRequirementText(request.requirementText());

        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<ProjectResponse> getUserProjects(UUID userId, ProjectStatus status, Pageable pageable) {
        User owner = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Page<Project> projects;
        if (status != null) {
            projects = projectRepository.findByOwnerAndStatus(owner, status, pageable);
        } else {
            projects = projectRepository.findByOwner(owner, pageable);
        }

        return projects.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(UUID projectId, UUID userId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        if (!project.getOwner().getId().equals(userId)) {
            throw new ResourceNotFoundException("Project", "id", projectId);
        }

        return toResponse(project);
    }

    @Transactional
    public void deleteProject(UUID projectId, UUID userId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        if (!project.getOwner().getId().equals(userId)) {
            throw new ResourceNotFoundException("Project", "id", projectId);
        }

        if (project.getStatus() == ProjectStatus.BUILDING) {
            throw new IllegalStateException("Cannot delete a project that is currently building");
        }

        projectRepository.delete(project);
    }

    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
            project.getId(),
            project.getName(),
            project.getDescription(),
            project.getRequirementText(),
            project.getStatus().name(),
            project.getCreatedAt(),
            project.getUpdatedAt()
        );
    }
}
