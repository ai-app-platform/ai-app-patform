package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Prompt;
import com.aibuilder.domain.entity.PromptStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PromptRepository extends JpaRepository<Prompt, UUID> {

    Optional<Prompt> findByName(String name);

    boolean existsByName(String name);

    Page<Prompt> findByStatus(PromptStatus status, Pageable pageable);
}
