package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Skill;
import com.aibuilder.domain.entity.SkillVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillVersionRepository extends JpaRepository<SkillVersion, UUID> {

    List<SkillVersion> findBySkillOrderByCreatedAtDesc(Skill skill);

    Optional<SkillVersion> findBySkillAndVersion(Skill skill, String version);

    boolean existsBySkillAndVersion(Skill skill, String version);
}
