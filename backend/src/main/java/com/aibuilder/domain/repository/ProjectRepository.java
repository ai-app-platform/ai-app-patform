package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Project;
import com.aibuilder.domain.entity.ProjectStatus;
import com.aibuilder.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    Page<Project> findByOwner(User owner, Pageable pageable);

    Page<Project> findByOwnerAndStatus(User owner, ProjectStatus status, Pageable pageable);

    long countByOwner(User owner);

    long countByOwnerAndStatus(User owner, ProjectStatus status);
}
