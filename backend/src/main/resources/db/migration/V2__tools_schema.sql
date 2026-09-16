-- Tools table
CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_tool_type CHECK (type IN ('HTTP', 'INTERNAL', 'MCP', 'DATABASE')),
    CONSTRAINT chk_tool_status CHECK (status IN ('DRAFT', 'ACTIVE', 'DISABLED', 'DEPRECATED'))
);

-- Tool versions table
CREATE TABLE tool_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    input_schema JSONB,
    output_schema JSONB,
    execution_config JSONB,
    authentication_config JSONB,
    timeout_ms INTEGER DEFAULT 10000,
    retry_count INTEGER DEFAULT 2,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_tool_version_unique UNIQUE (tool_id, version)
);

-- Indexes
CREATE INDEX idx_tools_name ON tools(name);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_type ON tools(type);
CREATE INDEX idx_tools_enabled ON tools(enabled);
CREATE INDEX idx_tool_versions_tool_id ON tool_versions(tool_id);
CREATE INDEX idx_tool_versions_version ON tool_versions(version);
