package com.example.main_service.rbac;

import com.example.main_service.rbac.model.RoleUserEntity;
import com.example.main_service.rbac.repo.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RbacService {

    private final RoleUserRepo roleUserRepo;
    private final RolePermissionRepo rolePermissionRepo;
    private final PermissionRepo permRepo;

    public RbacService(RoleUserRepo roleUserRepo,
                       RolePermissionRepo rolePermissionRepo,
                       PermissionRepo permRepo) {

        this.roleUserRepo = roleUserRepo;
        this.rolePermissionRepo = rolePermissionRepo;
        this.permRepo = permRepo;
    }

    public boolean hasPermission(Authentication auth,
                                 String permission,
                                 String scopeTypeStr,
                                 Long scopeId) {

        if (auth == null) return false;

        Long userId =  (Long) auth.getPrincipal();

        RoleUserEntity.ScopeType scopeType = RoleUserEntity.ScopeType.valueOf(scopeTypeStr); //convert enum

        System.out.println(userId + " " + scopeType + " ");
        System.out.println(scopeId + "\n");

        List<Integer> roleIds = roleUserRepo.findRoleIds(userId, scopeType, scopeId);
        if (roleIds.isEmpty()) return false;

        // 2. Lấy permission_id từ role
        List<Integer> permIds = rolePermissionRepo.findPermissionIdsByRoleIds(roleIds);
        if (permIds.isEmpty()) return false;

        // 3. Lấy permission_name
        List<String> permNames = permRepo.findPermissionNamesByIds(permIds);
        System.out.println(permNames);
        return permNames.contains(permission);
    }
}
