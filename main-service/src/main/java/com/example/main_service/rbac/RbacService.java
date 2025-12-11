package com.example.main_service.rbac;

import com.example.main_service.rbac.model.RoleUserEntity;
import com.example.main_service.rbac.repo.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class RbacService {

    private final RoleUserRepo roleUserRepo;
    private final RolePermissionRepo rolePermissionRepo;
    private final PermissionRepo permRepo;
    private final RoleRepo roleRepo;

    public RbacService(RoleUserRepo roleUserRepo,
                       RolePermissionRepo rolePermissionRepo,
                       PermissionRepo permRepo,
                       RoleRepo roleRepo) {

        this.roleUserRepo = roleUserRepo;
        this.rolePermissionRepo = rolePermissionRepo;
        this.permRepo = permRepo;
        this.roleRepo = roleRepo;
    }

    public boolean hasPermission(Authentication auth,
                                 String permission,
                                 String scopeTypeStr,
                                 String scopeId) {

        if (auth == null) return false;

        Long userId =  (Long) auth.getPrincipal();

        RoleUserEntity.ScopeType scopeType = RoleUserEntity.ScopeType.valueOf(scopeTypeStr); //convert enum

        System.out.println(userId + " " + scopeType + " ");
        System.out.println(scopeId + "\n");

        try {
            List<Integer> roleIds = roleUserRepo.findRoleIds(userId, scopeType, scopeId);
            if (roleIds.isEmpty()) return false;
            // 2. Lấy permission_id từ role
            List<Integer> permIds = rolePermissionRepo.findPermissionIdsByRoleIds(roleIds);
            if (permIds.isEmpty()) return false;

            // 3. Lấy permission_name
            List<String> permNames = permRepo.findPermissionNamesByIds(permIds);
            System.out.println(permNames);
            return permNames.contains(permission);

        } catch (Exception e) {
            return false; // bắt mọi lỗi → coi như không có permission
        }
    }

    @Transactional
    public void assignRole(Long userId,
                           String roleName,
                           String scopeTypeStr,
                           String scopeId) {

        // 1. Lấy role_id từ tên role
        Integer roleId = roleRepo.findRoleIdByName(roleName);
        if (roleId == null) {
            throw new IllegalStateException("Role not found: " + roleName);
        }

        // 2. Insert vào role_user
        RoleUserEntity.ScopeType scopeType = RoleUserEntity.ScopeType.valueOf(scopeTypeStr);
        roleUserRepo.insertRoleUser(
                roleId,
                userId,
                scopeId,
                scopeType.name()
        );
    }


    public static Long getUserIdFromToken() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return 0l; // tuc la k care mày là ai

        Object principal = auth.getPrincipal();

        if (principal instanceof Long l) {
            return l;
        }
        return 0l;
    }
}
