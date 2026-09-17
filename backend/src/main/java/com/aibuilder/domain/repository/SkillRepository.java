package com.aibuilder.domain.repository;

import com.aibuilder.domain.entity.Skill;
import com.aibuilder.domain.entity.SkillStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillRepository extends JpaRepository<Skill, UUID> {

    Optional<Skill> findByName(String name);

    boolean existsByName(String name);

    Page<Skill> findByStatus(SkillStatus status, Pageable pageable);
}
