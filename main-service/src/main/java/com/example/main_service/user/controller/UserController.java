package com.example.main_service.user.controller;

import com.example.main_service.rbac.PermissionService;
import com.example.main_service.rbac.RoleService;
import com.example.main_service.rbac.repo.PermissionRepo;
import com.example.main_service.rbac.repo.RoleRepo;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.user.dto.PermissionDto;
import com.example.main_service.user.dto.RoleDto;
import com.example.main_service.user.dto.UserDetailDto;
import com.example.main_service.user.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final RoleService roleService;
    private final PermissionService permissionService;

    @PostMapping("/admin/roles/search")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'rbac', 'System', 0)")
    public PageResult<RoleDto> searchRoles(@RequestBody PageRequestDto<Object> request) {
        return roleService.searchRoles(request.getPageRequest());
    }

    @PostMapping("/admin/permissions/search")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'rbac', 'System', 0)")
    public PageResult<PermissionDto> searchPermissions(@RequestBody PageRequestDto<Object> request) {
        return permissionService.searchPermissions(request.getPageRequest());
    }

    @GetMapping("/user/{user_name}")
    public UserDetailDto getUserProfile(@PathVariable("user_name") String username) {
        return userService.getUserDetail(username);
    }
}
