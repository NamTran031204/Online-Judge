package com.example.main_service.user.controller;

import com.example.main_service.dashboard.dtos.UserContestRatingHistoryItemDto;
import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.user.dto.*;
import com.example.main_service.user.service.AdminUserService;
import com.example.main_service.user.service.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class UserController {

    private final UserServiceImpl userService;
    private final AdminUserService adminUserService;

    @GetMapping("/admin/roles/{roleId}")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'rbac', 'SYSTEM', 0)")
    public CommonResponse<RoleDetailDto> getRoleDetail(
            @PathVariable Integer roleId
    ) {
        return CommonResponse.success(
                adminUserService.getRoleDetail(roleId)
        );
    }

    @PutMapping("/admin/roles/{roleId}/permissions")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'rbac', 'SYSTEM', 0)")
    public CommonResponse<Void> updateRolePermissions(
            @PathVariable Integer roleId,
            @RequestBody UpdateRolePermissionRequestDto request
    ) {
        adminUserService.updateRolePermissions(roleId, request);
        return CommonResponse.success();
    }

    @PostMapping("/admin/users/search")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'rbac', 'SYSTEM', 0)")
    public CommonResponse<PageResult<AdminUserItemDto>> searchUsers(
            @RequestBody PageRequestDto<AdminUserFilterDto> request
    ) {
        return CommonResponse.success(
                adminUserService.searchUsers(request)
        );
    }

    // Thay role user
    @PostMapping("/admin/users/{userId}/role")
    @PreAuthorize("@rbacService.hasPermission(authentication, 'rbac', 'SYSTEM', 0)")
    public CommonResponse<Void> updateUserRole(
            @PathVariable Integer userId,
            @RequestBody UpdateUserRoleRequestDto request
    ) {
        adminUserService.updateUserRole(userId, request);
        return CommonResponse.success();
    }

    // Admin chỉnh rating user (manual override)
    @PostMapping("/admin/users/{userId}/rating")
    public CommonResponse<Void> updateUserRating(
            @PathVariable Integer userId,
            @RequestBody UpdateUserRatingRequestDto request
    ) {
        adminUserService.updateUserRating(userId, request);
        return CommonResponse.success();
    }

    /// /////user////////
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
