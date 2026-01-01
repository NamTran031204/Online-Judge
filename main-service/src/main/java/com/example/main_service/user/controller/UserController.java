package com.example.main_service.user.controller;

import com.example.main_service.dashboard.dtos.UserContestRatingHistoryItemDto;
import com.example.main_service.rbac.PermissionService;
import com.example.main_service.rbac.RoleService;
import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.user.dto.PermissionDto;
import com.example.main_service.user.dto.RoleDto;
import com.example.main_service.user.dto.UserDetailDto;
import com.example.main_service.user.service.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// them api xem rating history
// them admin api set 1 user len pro_user (role_user)
@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class UserController {

    private final UserServiceImpl userService;
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
    public CommonResponse<UserDetailDto> getUserProfile(@PathVariable("user_name") String username) {
        return CommonResponse.success(userService.getUserDetail(username));
    }

    @GetMapping("/user/rating-history/{user_id}")
    public CommonResponse<List<UserContestRatingHistoryItemDto>> getMyRatingHistory(
            @PathVariable("user_id") Long userId
    ) {
        return CommonResponse.success(userService.getUserRatingHistory(userId));
    }
}
