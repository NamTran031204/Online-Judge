package com.example.main_service.rbac.repo;


import com.example.main_service.rbac.model.RolePermissionEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RolePermissionRepo extends CrudRepository<RolePermissionEntity, Integer> {

    @Query("""
            SELECT rp.permissionId
            FROM RolePermissionEntity rp
            WHERE rp.roleId IN :roleIds
            """)
    List<Integer> findPermissionIdsByRoleIds(List<Integer> roleIds);
}

