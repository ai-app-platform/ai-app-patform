package com.aibuilder.application.service;

import com.aibuilder.application.dto.CreateSkillRequest;
import com.aibuilder.application.dto.SkillResponse;
import com.aibuilder.domain.entity.Skill;
import com.aibuilder.domain.entity.SkillStatus;
import com.aibuilder.domain.entity.SkillVersion;
import com.aibuilder.domain.exception.BusinessException;
import com.aibuilder.domain.exception.ResourceNotFoundException;
import com.aibuilder.domain.repository.SkillRepository;
import com.aibuilder.domain.repository.SkillVersionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final SkillVersionRepository skillVersionRepository;

    public SkillService(SkillRepository skillRepository, SkillVersionRepository skillVersionRepository) {
        this.skillRepository = skillRepository;
        this.skillVersionRepository = skillVersionRepository;
    }

    @Transactional
    public SkillResponse createSkill(CreateSkillRequest request) {
        if (skillRepository.existsByName(request.name())) {
            throw new BusinessException("SKILL_NAME_EXISTS", "A skill with this name already exists");
        }

        Skill skill = new Skill(request.name(), request.displayName(), request.description());
        skill.setCategory(request.category());
        skill.setDependencies(request.dependencies());

        Skill savedSkill = skillRepository.save(skill);

        // Create initial version
        SkillVersion version = new SkillVersion(savedSkill, "v1.0.0");
        version.setDefinition(request.definition());
        version.setInstructions(request.instructions());
        skillVersionRepository.save(version);

        return toResponse(savedSkill, version);
    }

    @Transactional(readOnly = true)
    public Page<SkillResponse> getAllSkills(Pageable pageable) {
        return skillRepository.findAll(pageable).map(skill -> {
            SkillVersion latestVersion = skillVersionRepository.findBySkillOrderByCreatedAtDesc(skill)
                .stream()
                .findFirst()
                .orElse(null);
            return toResponse(skill, latestVersion);
        });
    }

    @Transactional(readOnly = true)
    public SkillResponse getSkill(UUID skillId) {
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId));

        SkillVersion latestVersion = skillVersionRepository.findBySkillOrderByCreatedAtDesc(skill)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(skill, latestVersion);
    }

    @Transactional
    public SkillResponse activateSkill(UUID skillId) {
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId));

        skill.activate();
        Skill savedSkill = skillRepository.save(skill);

        SkillVersion latestVersion = skillVersionRepository.findBySkillOrderByCreatedAtDesc(skill)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(savedSkill, latestVersion);
    }

    @Transactional
    public SkillResponse deprecateSkill(UUID skillId) {
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId));

        skill.deprecate();
        Skill savedSkill = skillRepository.save(skill);

        SkillVersion latestVersion = skillVersionRepository.findBySkillOrderByCreatedAtDesc(skill)
            .stream()
            .findFirst()
            .orElse(null);

        return toResponse(savedSkill, latestVersion);
    }

    @Transactional
    public void deleteSkill(UUID skillId) {
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId));

        if (skill.getStatus() == SkillStatus.ACTIVE) {
            throw new BusinessException("SKILL_ACTIVE", "Cannot delete an active skill. Deprecate it first.");
        }

        skillRepository.delete(skill);
    }

    private SkillResponse toResponse(Skill skill, SkillVersion version) {
        return new SkillResponse(
            skill.getId(),
            skill.getName(),
            skill.getDisplayName(),
            skill.getDescription(),
            skill.getCategory(),
            skill.getStatus().name(),
            version != null ? version.getVersion() : null,
            skill.getDependencies(),
            version != null ? version.getDefinition() : null,
            version != null ? version.getInstructions() : null,
            skill.getCreatedAt(),
            skill.getUpdatedAt()
        );
    }
}
