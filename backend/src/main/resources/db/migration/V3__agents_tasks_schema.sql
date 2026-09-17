-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    model_config JSONB,
    prompt_references JSONB,
    skill_references JSONB,
    tool_references JSONB,
    runtime_config JSONB,
    execution_policies JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_agent_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'DEPRECATED'))
);

-- Agent versions table
CREATE TABLE agent_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    role_version VARCHAR(20),
    prompt_version JSONB,
    skill_versions JSONB,
    tool_versions JSONB,
    snapshot JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_agent_version_unique UNIQUE (agent_id, version)
);

-- Project agent teams table
CREATE TABLE project_agent_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    agent_version_id UUID REFERENCES agent_versions(id) ON DELETE SET NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_team_member_unique UNIQUE (project_id, agent_id)
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    requirement_text TEXT,
    plan JSONB,
    execution_graph JSONB,
    selected_agents JSONB,
    execution_state JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    selection_mode VARCHAR(20) NOT NULL DEFAULT 'AUTOMATIC',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    CONSTRAINT chk_task_status CHECK (status IN ('PENDING', 'PLANNING', 'RUNNING', 'COMPLETED', 'FAILED')),
    CONSTRAINT chk_task_selection_mode CHECK (selection_mode IN ('AUTOMATIC', 'MANUAL', 'AUTOMATIC_WITH_APPROVAL'))
);

-- Indexes
CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_agents_name ON agents(name);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_role_id ON agents(role_id);
CREATE INDEX idx_agent_versions_agent_id ON agent_versions(agent_id);
CREATE INDEX idx_agent_versions_version ON agent_versions(version);
CREATE INDEX idx_project_agent_teams_project_id ON project_agent_teams(project_id);
CREATE INDEX idx_project_agent_teams_agent_id ON project_agent_teams(agent_id);
CREATE INDEX idx_project_agent_teams_enabled ON project_agent_teams(enabled);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
