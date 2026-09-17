package com.aibuilder.api.controller;

import com.aibuilder.application.dto.CreateSkillRequest;
import com.aibuilder.application.dto.SkillResponse;
import com.aibuilder.application.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping
    public ResponseEntity<SkillResponse> createSkill(@Valid @RequestBody CreateSkillRequest request) {
        SkillResponse response = skillService.createSkill(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<SkillResponse>> getAllSkills(@PageableDefault(size = 20) Pageable pageable) {
        Page<SkillResponse> skills = skillService.getAllSkills(pageable);
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/{skillId}")
    public ResponseEntity<SkillResponse> getSkill(@PathVariable UUID skillId) {
        SkillResponse response = skillService.getSkill(skillId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{skillId}/activate")
    public ResponseEntity<SkillResponse> activateSkill(@PathVariable UUID skillId) {
        SkillResponse response = skillService.activateSkill(skillId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{skillId}/deprecate")
    public ResponseEntity<SkillResponse> deprecateSkill(@PathVariable UUID skillId) {
        SkillResponse response = skillService.deprecateSkill(skillId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<Void> deleteSkill(@PathVariable UUID skillId) {
        skillService.deleteSkill(skillId);
        return ResponseEntity.noContent().build();
    }
}
