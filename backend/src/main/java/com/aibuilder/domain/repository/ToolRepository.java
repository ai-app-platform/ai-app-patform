package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Tool;
import com.aibuilder.domain.entity.ToolStatus;
import com.aibuilder.domain.entity.ToolType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ToolRepository extends JpaRepository<Tool, UUID> {

    Optional<Tool> findByName(String name);

    boolean existsByName(String name);

    Page<Tool> findByStatus(ToolStatus status, Pageable pageable);

    Page<Tool> findByType(ToolType type, Pageable pageable);

    List<Tool> findByEnabledTrue();

    List<Tool> findByStatusAndEnabledTrue(ToolStatus status);
}
