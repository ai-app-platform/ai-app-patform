package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Project;
import com.aibuilder.domain.entity.Task;
import com.aibuilder.domain.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    Page<Task> findByProject(Project project, Pageable pageable);

    Page<Task> findByProjectAndStatus(Project project, TaskStatus status, Pageable pageable);

    long countByProject(Project project);

    long countByProjectAndStatus(Project project, TaskStatus status);
}
