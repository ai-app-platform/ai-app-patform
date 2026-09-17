package com.aibuilder.application.service;

import com.aibuilder.application.dto.AgentResponse;
import com.aibuilder.application.dto.CreateAgentRequest;
import com.aibuilder.domain.entity.Agent;
import com.aibuilder.domain.entity.AgentStatus;
import com.aibuilder.domain.entity.AgentVersion;
import com.aibuilder.domain.entity.Role;
import com.aibuilder.domain.exception.BusinessException;
import com.aibuilder.domain.exception.ResourceNotFoundException;
import com.aibuilder.domain.repository.AgentRepository;
import com.aibuilder.domain.repository.AgentVersionRepository;
import com.aibuilder.domain.repository.RoleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AgentService {

    private final AgentRepository agentRepository;
    private final AgentVersionRepository agentVersionRepository;
    private final RoleRepository roleRepository;

    public AgentService(AgentRepository agentRepository, AgentVersionRepository agentVersionRepository,
                        RoleRepository roleRepository) {
        this.agentRepository = agentRepository;
        this.agentVersionRepository = agentVersionRepository;
        this.roleRepository = roleRepository;
    }

    @Transactional
    public AgentResponse createAgent(CreateAgentRequest request) {
        if (agentRepository.existsByName(request.name())) {
            throw new BusinessException("AGENT_NAME_EXISTS", "An agent with this name already exists");
        }

        Role role = null;
        if (request.roleName() != null) {
            role = roleRepository.findByName(request.roleName())
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", request.roleName()));
        }

        Agent agent = new Agent(request.name(), request.displayName(), request.description(), role);
        agent.setModelConfig(request.modelConfig());
        agent.setPromptReferences(request.promptReferences());
        agent.setSkillReferences(request.skillReferences());
        agent.setToolReferences(request.toolReferences());
        agent.setRuntimeConfig(request.runtimeConfig());
        agent.setExecutionPolicies(request.executionPolicies());

        Agent savedAgent = agentRepository.save(agent);

        // Create initial version
        AgentVersion version = new AgentVersion(savedAgent, "v1.0.0");
        agentVersionRepository.save(version);

        return toResponse(savedAgent, version);
    }

    @Transactional(readOnly = true)
    public Page<AgentResponse> getAllAgents(Pageable pageable) {
        return agentRepository.findAll(pageable).map(agent -> {
            AgentVersion latestVersion = agentVersionRepository.findByAgentOrderByCreatedAtDesc(agent)
                .stream()
                .findFirst()
                .orElse(null);
            return toResponse(agent, latestVersion);
        });
    }

    @Transactional(readOnly = true)
    public AgentResponse getAgent(UUID agentId) {
        Agent agent = agentRepository.findById(agentId)
            .orElseThrow(() -> new ResourceNotFoundException("Agent", "id", agentId));

        AgentVersion latestVersion = agentVersionRepository.findByAgentOrderByCreatedAtDesc(agent)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(agent, latestVersion);
    }

    @Transactional
    public AgentResponse publishAgent(UUID agentId) {
        Agent agent = agentRepository.findById(agentId)
            .orElseThrow(() -> new ResourceNotFoundException("Agent", "id", agentId));

        agent.publish();
        Agent savedAgent = agentRepository.save(agent);

        AgentVersion latestVersion = agentVersionRepository.findByAgentOrderByCreatedAtDesc(agent)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(savedAgent, latestVersion);
    }

    @Transactional
    public AgentResponse deprecateAgent(UUID agentId) {
        Agent agent = agentRepository.findById(agentId)
            .orElseThrow(() -> new ResourceNotFoundException("Agent", "id", agentId));

        agent.deprecate();
        Agent savedAgent = agentRepository.save(agent);

        AgentVersion latestVersion = agentVersionRepository.findByAgentOrderByCreatedAtDesc(agent)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(savedAgent, latestVersion);
    }

    @Transactional
    public void deleteAgent(UUID agentId) {
        Agent agent = agentRepository.findById(agentId)
            .orElseThrow(() -> new ResourceNotFoundException("Agent", "id", agentId));

        if (agent.getStatus() == AgentStatus.PUBLISHED) {
            throw new BusinessException("AGENT_PUBLISHED",
                "Cannot delete a published agent. Deprecate it first.");
        }

        agentRepository.delete(agent);
    }

    private AgentResponse toResponse(Agent agent, AgentVersion version) {
        return new AgentResponse(
            agent.getId(),
            agent.getName(),
            agent.getDisplayName(),
            agent.getDescription(),
            agent.getRole() != null ? agent.getRole().getName() : null,
            agent.getRole() != null ? agent.getRole().getDisplayName() : null,
            agent.getStatus().name(),
            version != null ? version.getVersion() : null,
            agent.getModelConfig(),
            agent.getPromptReferences(),
            agent.getSkillReferences(),
            agent.getToolReferences(),
            agent.getRuntimeConfig(),
            agent.getExecutionPolicies(),
            agent.getCreatedAt(),
            agent.getUpdatedAt()
        );
    }
}
