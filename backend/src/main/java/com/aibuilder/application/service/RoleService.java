package com.aibuilder.application.service;

import com.aibuilder.application.dto.CreateRoleRequest;
import com.aibuilder.application.dto.RoleResponse;
import com.aibuilder.domain.entity.Role;
import com.aibuilder.domain.entity.RoleStatus;
import com.aibuilder.domain.entity.RoleVersion;
import com.aibuilder.domain.exception.BusinessException;
import com.aibuilder.domain.exception.ResourceNotFoundException;
import com.aibuilder.domain.repository.RoleRepository;
import com.aibuilder.domain.repository.RoleVersionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final RoleVersionRepository roleVersionRepository;

    public RoleService(RoleRepository roleRepository, RoleVersionRepository roleVersionRepository) {
        this.roleRepository = roleRepository;
        this.roleVersionRepository = roleVersionRepository;
    }

    @Transactional
    public RoleResponse createRole(CreateRoleRequest request) {
        if (roleRepository.existsByName(request.name())) {
            throw new BusinessException("ROLE_NAME_EXISTS", "A role with this name already exists");
        }

        Role role = new Role(request.name(), request.displayName(), request.description());
        role.setCategory(request.category());

        Role savedRole = roleRepository.save(role);

        // Create initial version
        RoleVersion version = new RoleVersion(savedRole, "v1.0.0");
        version.setResponsibilities(request.responsibilities());
        version.setConstraints(request.constraints());
        version.setRequiredSkills(request.requiredSkills());
        version.setPreferredSkills(request.preferredSkills());
        version.setToolCapabilities(request.toolCapabilities());
        version.setPromptRefs(request.promptRefs());
        version.setExpectedOutputs(request.expectedOutputs());
        roleVersionRepository.save(version);

        return toResponse(savedRole, version);
    }

    @Transactional(readOnly = true)
    public Page<RoleResponse> getAllRoles(Pageable pageable) {
        return roleRepository.findAll(pageable).map(role -> {
            RoleVersion latestVersion = roleVersionRepository.findByRoleOrderByCreatedAtDesc(role)
                .stream()
                .findFirst()
                .orElse(null);
            return toResponse(role, latestVersion);
        });
    }

    @Transactional(readOnly = true)
    public RoleResponse getRole(UUID roleId) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));

        RoleVersion latestVersion = roleVersionRepository.findByRoleOrderByCreatedAtDesc(role)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(role, latestVersion);
    }

    @Transactional
    public RoleResponse activateRole(UUID roleId) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));

        role.activate();
        Role savedRole = roleRepository.save(role);

        RoleVersion latestVersion = roleVersionRepository.findByRoleOrderByCreatedAtDesc(role)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(savedRole, latestVersion);
    }

    @Transactional
    public RoleResponse deprecateRole(UUID roleId) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));

        role.deprecate();
        Role savedRole = roleRepository.save(role);

        RoleVersion latestVersion = roleVersionRepository.findByRoleOrderByCreatedAtDesc(role)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(savedRole, latestVersion);
    }

    @Transactional
    public void deleteRole(UUID roleId) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));

        if (role.getStatus() == RoleStatus.ACTIVE) {
            throw new BusinessException("ROLE_ACTIVE", "Cannot delete an active role. Deprecate it first.");
        }

        roleRepository.delete(role);
    }

    private RoleResponse toResponse(Role role, RoleVersion version) {
        return new RoleResponse(
            role.getId(),
            role.getName(),
            role.getDisplayName(),
            role.getDescription(),
            role.getCategory(),
            role.getStatus().name(),
            version != null ? version.getVersion() : null,
            version != null ? version.getResponsibilities() : null,
            version != null ? version.getConstraints() : null,
            version != null ? version.getRequiredSkills() : null,
            version != null ? version.getPreferredSkills() : null,
            version != null ? version.getToolCapabilities() : null,
            version != null ? version.getPromptRefs() : null,
            role.getCreatedAt(),
            role.getUpdatedAt()
        );
    }
}
