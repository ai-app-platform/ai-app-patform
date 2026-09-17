package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Agent;
import com.aibuilder.domain.entity.AgentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AgentRepository extends JpaRepository<Agent, UUID> {

    Optional<Agent> findByName(String name);

    boolean existsByName(String name);

    Page<Agent> findByStatus(AgentStatus status, Pageable pageable);

    List<Agent> findByStatus(AgentStatus status);
}
