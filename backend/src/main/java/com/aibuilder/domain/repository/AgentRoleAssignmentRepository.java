package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Agent;
import com.aibuilder.domain.entity.AgentRoleAssignment;
import com.aibuilder.domain.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AgentRoleAssignmentRepository extends JpaRepository<AgentRoleAssignment, UUID> {

    List<AgentRoleAssignment> findByAgent(Agent agent);

    List<AgentRoleAssignment> findByRole(Role role);

    Optional<AgentRoleAssignment> findByAgentAndRole(Agent agent, Role role);

    boolean existsByAgentAndRole(Agent agent, Role role);

    void deleteByAgentAndRole(Agent agent, Role role);
}
