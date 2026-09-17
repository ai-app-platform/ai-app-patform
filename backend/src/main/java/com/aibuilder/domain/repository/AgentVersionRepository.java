package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Agent;
import com.aibuilder.domain.entity.AgentVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AgentVersionRepository extends JpaRepository<AgentVersion, UUID> {

    List<AgentVersion> findByAgentOrderByCreatedAtDesc(Agent agent);

    Optional<AgentVersion> findByAgentAndVersion(Agent agent, String version);

    boolean existsByAgentAndVersion(Agent agent, String version);
}
