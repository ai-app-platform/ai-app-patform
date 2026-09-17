package com.aibuilder.api.controller;

import com.aibuilder.application.dto.CreateRoleRequest;
import com.aibuilder.application.dto.RoleResponse;
import com.aibuilder.application.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    public ResponseEntity<RoleResponse> createRole(@Valid @RequestBody CreateRoleRequest request) {
        RoleResponse response = roleService.createRole(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<RoleResponse>> getAllRoles(@PageableDefault(size = 20) Pageable pageable) {
        Page<RoleResponse> roles = roleService.getAllRoles(pageable);
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/{roleId}")
    public ResponseEntity<RoleResponse> getRole(@PathVariable UUID roleId) {
        RoleResponse response = roleService.getRole(roleId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{roleId}/activate")
    public ResponseEntity<RoleResponse> activateRole(@PathVariable UUID roleId) {
        RoleResponse response = roleService.activateRole(roleId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{roleId}/deprecate")
    public ResponseEntity<RoleResponse> deprecateRole(@PathVariable UUID roleId) {
        RoleResponse response = roleService.deprecateRole(roleId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{roleId}")
    public ResponseEntity<Void> deleteRole(@PathVariable UUID roleId) {
        roleService.deleteRole(roleId);
        return ResponseEntity.noContent().build();
    }
}
