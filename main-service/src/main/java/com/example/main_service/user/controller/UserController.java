package com.example.main_service.user.controller;

import com.example.main_service.rbac.RbacService;
import com.example.main_service.rbac.model.PermissionEntity;
import com.example.main_service.rbac.model.RoleEntity;
import com.example.main_service.rbac.repo.PermissionRepo;
import com.example.main_service.rbac.repo.RoleRepo;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.user.dto.PermissionDto;
import com.example.main_service.user.dto.RoleDto;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@AllArgsConstructor
public class UserController {

    private final RoleRepo roleRepo;
    private final PermissionRepo permRepo;
    private final RbacService rbacService;

    @PostMapping("/roles/search")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'user:delete', 'System', -1)")
    public PageResult<RoleDto> searchRoles(@RequestBody PageRequestDto<Object> request) {
        Pageable pageable = request.getPageRequest();
        Page<RoleEntity> page = roleRepo.findAll(pageable);
        List<RoleDto> roles = page.getContent().stream()
                .map(r -> new RoleDto(r.getRoleId(), r.getRoleName()))
                .collect(Collectors.toList());

        return new PageResult<>(page.getTotalElements(), roles);
    }

    @PostMapping("/permissions/search")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'user:delete', 'System', -1)")
    public PageResult<PermissionDto> searchPermissions(@RequestBody PageRequestDto<Object> request) {
        Pageable pageable = request.getPageRequest();

        Page<PermissionEntity> page = permRepo.findAll(pageable);

        List<PermissionDto> perms = page.getContent().stream()
                .map(p -> new PermissionDto(p.getPermissionId(), p.getPermissionName()))
                .collect(Collectors.toList());

        return new PageResult<>(page.getTotalElements(), perms);
    }

}
