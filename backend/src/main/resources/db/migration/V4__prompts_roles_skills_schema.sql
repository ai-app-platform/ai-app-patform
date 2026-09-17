-- Prompts table
CREATE TABLE prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    scope VARCHAR(20) NOT NULL DEFAULT 'PLATFORM',
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    variables JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_prompt_scope CHECK (scope IN ('PLATFORM', 'PROJECT', 'WORKFLOW')),
    CONSTRAINT chk_prompt_status CHECK (status IN ('DRAFT', 'VALIDATING', 'ACTIVE', 'DEPRECATED', 'DISABLED', 'ARCHIVED'))
);

-- Prompt versions table
CREATE TABLE prompt_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    template TEXT NOT NULL,
    variable_metadata JSONB,
    model_config JSONB,
    composition_refs JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_prompt_version_unique UNIQUE (prompt_id, version)
);

-- Skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    dependencies JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_skill_status CHECK (status IN ('DRAFT', 'ACTIVE', 'DEPRECATED', 'DISABLED', 'ARCHIVED'))
);

-- Skill versions table
CREATE TABLE skill_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    definition JSONB,
    instructions TEXT,
    examples JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_skill_version_unique UNIQUE (skill_id, version)
);

-- Role versions table
CREATE TABLE role_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    responsibilities JSONB,
    constraints JSONB,
    required_skills JSONB,
    preferred_skills JSONB,
    tool_capabilities JSONB,
    prompt_refs JSONB,
    expected_outputs JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_role_version_unique UNIQUE (role_id, version)
);

-- Agent role assignments table
CREATE TABLE agent_role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    role_version_id UUID REFERENCES role_versions(id) ON DELETE SET NULL,
    primary_role BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_agent_role_unique UNIQUE (agent_id, role_id)
);

-- Agent skill assignments table
CREATE TABLE agent_skill_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    skill_version_id UUID REFERENCES skill_versions(id) ON DELETE SET NULL,
    proficiency_level VARCHAR(20) NOT NULL DEFAULT 'PROFICIENT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_agent_skill_unique UNIQUE (agent_id, skill_id),
    CONSTRAINT chk_proficiency_level CHECK (proficiency_level IN ('BEGINNER', 'INTERMEDIATE', 'PROFICIENT', 'EXPERT', 'MASTER'))
);

-- Add new columns to roles table
ALTER TABLE roles ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE roles ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'DRAFT';
ALTER TABLE roles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add new columns to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS agent_type VARCHAR(50);
ALTER TABLE agents ADD COLUMN IF NOT EXISTS capabilities JSONB;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS supported_roles JSONB;

-- Indexes
CREATE INDEX idx_prompts_name ON prompts(name);
CREATE INDEX idx_prompts_status ON prompts(status);
CREATE INDEX idx_prompts_scope ON prompts(scope);
CREATE INDEX idx_prompt_versions_prompt_id ON prompt_versions(prompt_id);
CREATE INDEX idx_prompt_versions_version ON prompt_versions(version);
CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_status ON skills(status);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skill_versions_skill_id ON skill_versions(skill_id);
CREATE INDEX idx_skill_versions_version ON skill_versions(version);
CREATE INDEX idx_role_versions_role_id ON role_versions(role_id);
CREATE INDEX idx_role_versions_version ON role_versions(version);
CREATE INDEX idx_agent_role_assignments_agent_id ON agent_role_assignments(agent_id);
CREATE INDEX idx_agent_role_assignments_role_id ON agent_role_assignments(role_id);
CREATE INDEX idx_agent_skill_assignments_agent_id ON agent_skill_assignments(agent_id);
CREATE INDEX idx_agent_skill_assignments_skill_id ON agent_skill_assignments(skill_id);
CREATE INDEX idx_roles_status ON roles(status);
CREATE INDEX idx_agents_type ON agents(agent_type);
