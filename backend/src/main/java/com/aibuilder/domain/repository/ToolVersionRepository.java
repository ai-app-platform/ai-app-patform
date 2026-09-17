package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Tool;
import com.aibuilder.domain.entity.ToolVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ToolVersionRepository extends JpaRepository<ToolVersion, UUID> {

    List<ToolVersion> findByToolOrderByCreatedAtDesc(Tool tool);

    Optional<ToolVersion> findByToolAndVersion(Tool tool, String version);

    boolean existsByToolAndVersion(Tool tool, String version);
}
