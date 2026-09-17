package com.aibuilder.application.service;

import com.aibuilder.application.dto.CreateTaskRequest;
import com.aibuilder.application.dto.TaskResponse;
import com.aibuilder.domain.entity.AgentSelectionMode;
import com.aibuilder.domain.entity.Project;
import com.aibuilder.domain.entity.Task;
import com.aibuilder.domain.entity.TaskStatus;
import com.aibuilder.domain.exception.ResourceNotFoundException;
import com.aibuilder.domain.repository.ProjectRepository;
import com.aibuilder.domain.repository.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional
    public TaskResponse createTask(UUID projectId, CreateTaskRequest request) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        Task task = new Task(project, request.title(), request.description());
        task.setRequirementText(request.requirementText());

        if (request.selectionMode() != null) {
            task.setSelectionMode(AgentSelectionMode.valueOf(request.selectionMode()));
        }

        Task saved = taskRepository.save(task);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> getProjectTasks(UUID projectId, TaskStatus status, Pageable pageable) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        Page<Task> tasks;
        if (status != null) {
            tasks = taskRepository.findByProjectAndStatus(project, status, pageable);
        } else {
            tasks = taskRepository.findByProject(project, pageable);
        }

        return tasks.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(UUID taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        return toResponse(task);
    }

    @Transactional
    public TaskResponse startTask(UUID taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        task.start();
        Task saved = taskRepository.save(task);
        return toResponse(saved);
    }

    @Transactional
    public TaskResponse completeTask(UUID taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        task.complete();
        Task saved = taskRepository.save(task);
        return toResponse(saved);
    }

    @Transactional
    public TaskResponse failTask(UUID taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        task.fail();
        Task saved = taskRepository.save(task);
        return toResponse(saved);
    }

    @Transactional
    public void deleteTask(UUID taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        if (task.getStatus() == TaskStatus.RUNNING) {
            throw new IllegalStateException("Cannot delete a running task");
        }

        taskRepository.delete(task);
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
            task.getId(),
            task.getProject().getId(),
            task.getTitle(),
            task.getDescription(),
            task.getRequirementText(),
            task.getPlan(),
            task.getExecutionGraph(),
            task.getSelectedAgents(),
            task.getExecutionState(),
            task.getStatus().name(),
            task.getSelectionMode().name(),
            task.getCreatedAt(),
            task.getUpdatedAt(),
            task.getStartedAt(),
            task.getCompletedAt()
        );
    }
}
