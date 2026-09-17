package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Role;
import com.aibuilder.domain.entity.RoleVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleVersionRepository extends JpaRepository<RoleVersion, UUID> {

    List<RoleVersion> findByRoleOrderByCreatedAtDesc(Role role);

    Optional<RoleVersion> findByRoleAndVersion(Role role, String version);

    boolean existsByRoleAndVersion(Role role, String version);
}
