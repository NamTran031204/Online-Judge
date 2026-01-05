package com.example.main_service.rbac;

import com.example.main_service.rbac.model.RoleUserEntity;
import com.example.main_service.rbac.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor

public class RbacService {

    private final RoleUserRepo roleUserRepo;
    private final RolePermissionRepo rolePermissionRepo;
    private final PermissionRepo permRepo;
    private final RoleRepo roleRepo;


    public boolean hasPermission(Authentication auth,
                                 String permission,
                                 String scopeTypeStr,
                                 String scopeId) {

        if (auth == null) return false;
        Long userId =  (Long) auth.getPrincipal();
        RoleUserEntity.ScopeType scopeType = RoleUserEntity.ScopeType.valueOf(scopeTypeStr);

        if(isAdmin(userId)) return true;

        try {
            List<Integer> roleIds = roleUserRepo.findRoleIds(userId, scopeType, scopeId);
            if (roleIds.isEmpty()) return false;
            List<Integer> permIds = rolePermissionRepo.findPermissionIdsByRoleIds(roleIds);
            if (permIds.isEmpty()) return false;
            List<String> permNames = permRepo.findPermissionNamesByIds(permIds);
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

        Integer roleId = roleRepo.findRoleIdByName(roleName);
        if (roleId == null) {
            throw new IllegalStateException("Role not found: " + roleName);
        }

        RoleUserEntity.ScopeType scopeType = RoleUserEntity.ScopeType.valueOf(scopeTypeStr);
        roleUserRepo.insertRoleUser(roleId, userId, scopeId, scopeType.name());
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

    public boolean isAdmin(Long userId) {
        if (userId == null || userId == 0L) return false;

        try {
            Integer adminRoleId = roleRepo.findRoleIdByName("ADMIN");
            if (adminRoleId == null) return false;

            // SYSTEM scope: scope_id "*" nghĩa là global
            RoleUserEntity.ScopeType scopeType = RoleUserEntity.ScopeType.SYSTEM;
            List<Integer> roleIds = roleUserRepo.findRoleIds(userId, scopeType, "*");

            return roleIds.contains(adminRoleId);
        } catch (Exception e) {
            return false;
        }
    }

}
