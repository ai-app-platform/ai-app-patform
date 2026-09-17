package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Agent;
import com.aibuilder.domain.entity.AgentSkillAssignment;
import com.aibuilder.domain.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AgentSkillAssignmentRepository extends JpaRepository<AgentSkillAssignment, UUID> {

    List<AgentSkillAssignment> findByAgent(Agent agent);

    List<AgentSkillAssignment> findBySkill(Skill skill);

    Optional<AgentSkillAssignment> findByAgentAndSkill(Agent agent, Skill skill);

    boolean existsByAgentAndSkill(Agent agent, Skill skill);

    void deleteByAgentAndSkill(Agent agent, Skill skill);
}
