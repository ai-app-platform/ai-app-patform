package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Prompt;
import com.aibuilder.domain.entity.PromptVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PromptVersionRepository extends JpaRepository<PromptVersion, UUID> {

    List<PromptVersion> findByPromptOrderByCreatedAtDesc(Prompt prompt);

    Optional<PromptVersion> findByPromptAndVersion(Prompt prompt, String version);

    boolean existsByPromptAndVersion(Prompt prompt, String version);
}
