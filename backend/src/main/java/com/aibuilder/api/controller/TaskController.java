package com.aibuilder.api.controller;

import com.aibuilder.application.dto.CreateTaskRequest;
import com.aibuilder.application.dto.TaskResponse;
import com.aibuilder.application.service.TaskService;
import com.aibuilder.domain.entity.TaskStatus;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateTaskRequest request) {
        TaskResponse response = taskService.createTask(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getProjectTasks(
            @PathVariable UUID projectId,
            @RequestParam(required = false) TaskStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<TaskResponse> tasks = taskService.getProjectTasks(projectId, status, pageable);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable UUID taskId) {
        TaskResponse response = taskService.getTask(taskId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{taskId}/start")
    public ResponseEntity<TaskResponse> startTask(@PathVariable UUID taskId) {
        TaskResponse response = taskService.startTask(taskId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{taskId}/complete")
    public ResponseEntity<TaskResponse> completeTask(@PathVariable UUID taskId) {
        TaskResponse response = taskService.completeTask(taskId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{taskId}/fail")
    public ResponseEntity<TaskResponse> failTask(@PathVariable UUID taskId) {
        TaskResponse response = taskService.failTask(taskId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}
