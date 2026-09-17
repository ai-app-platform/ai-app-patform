package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Agent;
import com.aibuilder.domain.entity.Project;
import com.aibuilder.domain.entity.ProjectAgentTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectAgentTeamRepository extends JpaRepository<ProjectAgentTeam, UUID> {

    List<ProjectAgentTeam> findByProject(Project project);

    List<ProjectAgentTeam> findByProjectAndEnabledTrue(Project project);

    Optional<ProjectAgentTeam> findByProjectAndAgent(Project project, Agent agent);

    boolean existsByProjectAndAgent(Project project, Agent agent);

    void deleteByProjectAndAgent(Project project, Agent agent);

    long countByProjectAndEnabledTrue(Project project);
}
