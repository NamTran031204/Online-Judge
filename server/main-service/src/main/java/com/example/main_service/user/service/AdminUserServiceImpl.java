package com.example.main_service.user.service;

import com.example.main_service.rbac.model.RoleEntity;
import com.example.main_service.rbac.model.RolePermissionEntity;
import com.example.main_service.rbac.model.RoleUserEntity;
import com.example.main_service.rbac.repo.PermissionRepo;
import com.example.main_service.rbac.repo.RolePermissionRepo;
import com.example.main_service.rbac.repo.RoleRepo;
import com.example.main_service.rbac.repo.RoleUserRepo;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.user.dto.*;
import com.example.main_service.user.model.UserRatingHistoryEntity;
import com.example.main_service.user.repo.UserRatingHistoryRepo;
import com.example.main_service.user.repo.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final RoleRepo roleRepository;
    private final PermissionRepo permissionRepository;
    private final RolePermissionRepo rolePermissionRepository;
    private final RoleUserRepo roleUserRepository;
    private final UserRepo userRepository; // bảng user của m
    private final UserRatingHistoryRepo userRatingHistoryRepo;

    /* =========================================================
       ROLE + PERMISSION
     ========================================================= */

    @Override
    public RoleDetailDto getRoleDetail(Integer roleId) {

        RoleEntity role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        List<Integer> permissionIds =
                rolePermissionRepository.findByRoleId(roleId)
                        .stream()
                        .map(RolePermissionEntity::getPermissionId)
                        .toList();

        List<PermissionDto> permissions =
                permissionRepository.findPermissionDetailByIds(permissionIds)
                        .stream()
                        .map(p -> new PermissionDto(
                                p.getPermissionId(),
                                p.getPermissionName()
                        ))
                        .toList();

        RoleDetailDto dto = new RoleDetailDto();
        dto.setRoleId(role.getRoleId());
        dto.setRoleName(role.getRoleName());
        dto.setPermissions(permissions);

        return dto;
    }

    @Override
    public void updateRolePermissions(
            Integer roleId,
            UpdateRolePermissionRequestDto request
    ) {
        roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // clear cũ
        rolePermissionRepository.deleteByRoleId(roleId);

        // insert mới
        for (Integer permissionId : request.getPermissionIds()) {
            RolePermissionEntity rp = new RolePermissionEntity();
            rp.setRoleId(roleId);
            rp.setPermissionId(permissionId);
            rolePermissionRepository.save(rp);
        }
    }

    /* =========================================================
       USER + ROLE
     ========================================================= */

    @Override
    public PageResult<AdminUserItemDto> searchUsers(
            PageRequestDto<AdminUserFilterDto> request
    ) {
        // phần này phụ thuộc bảng user → tao không đoán
        // nếu m muốn, gửi schema user table tao viết nốt
        throw new UnsupportedOperationException("Need user schema");
    }

    @Override
    public void updateUserRole(Integer userId, UpdateUserRoleRequestDto request) {

        userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        roleUserRepository.deleteByUserIdAndScopeType(
                userId,
                RoleUserEntity.ScopeType.SYSTEM
        );

        RoleUserEntity ru = RoleUserEntity.builder()
                .userId(userId)
                .roleId(request.getRoleId())
                .scopeType(RoleUserEntity.ScopeType.SYSTEM)
                .scopeId(null)
                .build();

        roleUserRepository.save(ru);
    }

    /* =========================================================
       USER RATING
     ========================================================= */

    @Override
    @Transactional
    public void updateUserRating(
            Integer userId,
            UpdateUserRatingRequestDto request
    ) {
        UserRatingHistoryEntity latest =
                userRatingHistoryRepo.findLatestByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException("User has no rating history"));

        int oldRating = latest.getRating();
        int newRating = request.getRating();

        latest.setRating(newRating);
        latest.setDelta(newRating - oldRating);

        userRatingHistoryRepo.save(latest);
    }

}

