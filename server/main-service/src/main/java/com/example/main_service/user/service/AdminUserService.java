package com.example.main_service.user.service;

import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.user.dto.*;

public interface AdminUserService {

    RoleDetailDto getRoleDetail(Integer roleId);

    void updateRolePermissions(Integer roleId, UpdateRolePermissionRequestDto request);

    PageResult<AdminUserItemDto> searchUsers(PageRequestDto<AdminUserFilterDto> request);

    void updateUserRole(Integer userId, UpdateUserRoleRequestDto request);

    void updateUserRating(Integer userId, UpdateUserRatingRequestDto request);
}

