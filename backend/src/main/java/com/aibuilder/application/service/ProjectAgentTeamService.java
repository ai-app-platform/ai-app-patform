package com.aibuilder.application.service;

import com.aibuilder.application.dto.ProjectAgentTeamResponse;
import com.aibuilder.domain.entity.Agent;
import com.aibuilder.domain.entity.AgentVersion;
import com.aibuilder.domain.entity.Project;
import com.aibuilder.domain.entity.ProjectAgentTeam;
import com.aibuilder.domain.exception.BusinessException;
import com.aibuilder.domain.exception.ResourceNotFoundException;
import com.aibuilder.domain.repository.AgentRepository;
import com.aibuilder.domain.repository.AgentVersionRepository;
import com.aibuilder.domain.repository.ProjectAgentTeamRepository;
import com.aibuilder.domain.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectAgentTeamService {

    private final ProjectAgentTeamRepository teamRepository;
    private final ProjectRepository projectRepository;
    private final AgentRepository agentRepository;
    private final AgentVersionRepository agentVersionRepository;

    public ProjectAgentTeamService(ProjectAgentTeamRepository teamRepository,
                                    ProjectRepository projectRepository,
                                    AgentRepository agentRepository,
                                    AgentVersionRepository agentVersionRepository) {
        this.teamRepository = teamRepository;
        this.projectRepository = projectRepository;
        this.agentRepository = agentRepository;
        this.agentVersionRepository = agentVersionRepository;
    }

    @Transactional
    public ProjectAgentTeamResponse addAgentToTeam(UUID projectId, UUID agentId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        Agent agent = agentRepository.findById(agentId)
            .orElseThrow(() -> new ResourceNotFoundException("Agent", "id", agentId));

        if (teamRepository.existsByProjectAndAgent(project, agent)) {
            throw new BusinessException("AGENT_ALREADY_IN_TEAM",
                "This agent is already in the project team");
        }

        ProjectAgentTeam teamMember = new ProjectAgentTeam(project, agent);

        // Get latest version
        AgentVersion latestVersion = agentVersionRepository.findByAgentOrderByCreatedAtDesc(agent)
            .stream()
            .findFirst()
            .orElse(null);
        teamMember.setAgentVersion(latestVersion);

        ProjectAgentTeam saved = teamRepository.save(teamMember);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ProjectAgentTeamResponse> getProjectTeam(UUID projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        return teamRepository.findByProject(project).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectAgentTeamResponse> getEnabledProjectTeam(UUID projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        return teamRepository.findByProjectAndEnabledTrue(project).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public ProjectAgentTeamResponse enableAgent(UUID projectId, UUID agentId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        Agent agent = agentRepository.findById(agentId)
            .orElseThrow(() -> new ResourceNotFoundException("Agent", "id", agentId));

        ProjectAgentTeam teamMember = teamRepository.findByProjectAndAgent(project, agent)
            .orElseThrow(() -> new ResourceNotFoundException("TeamMember", "agentId", agentId));

        teamMember.enable();
        ProjectAgentTeam saved = teamRepository.save(teamMember);
        return toResponse(saved);
    }

    @Transactional
    public ProjectAgentTeamResponse disableAgent(UUID projectId, UUID agentId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        Agent agent = agentRepository.findById(agentId)
            .orElseThrow(() -> new ResourceNotFoundException("Agent", "id", agentId));

        ProjectAgentTeam teamMember = teamRepository.findByProjectAndAgent(project, agent)
            .orElseThrow(() -> new ResourceNotFoundException("TeamMember", "agentId", agentId));

        teamMember.disable();
        ProjectAgentTeam saved = teamRepository.save(teamMember);
        return toResponse(saved);
    }

    @Transactional
    public void removeAgentFromTeam(UUID projectId, UUID agentId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        Agent agent = agentRepository.findById(agentId)
            .orElseThrow(() -> new ResourceNotFoundException("Agent", "id", agentId));

        teamRepository.deleteByProjectAndAgent(project, agent);
    }

    private ProjectAgentTeamResponse toResponse(ProjectAgentTeam teamMember) {
        Agent agent = teamMember.getAgent();
        return new ProjectAgentTeamResponse(
            teamMember.getId(),
            teamMember.getProject().getId(),
            agent.getId(),
            agent.getName(),
            agent.getDisplayName(),
            teamMember.getAgentVersion() != null ? teamMember.getAgentVersion().getVersion() : null,
            agent.getRole() != null ? agent.getRole().getName() : null,
            teamMember.isEnabled(),
            teamMember.getCreatedAt(),
            teamMember.getUpdatedAt()
        );
    }
}
