package com.example.main_service.rbac.repo;


import com.example.main_service.rbac.model.RolePermissionEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolePermissionRepo extends CrudRepository<RolePermissionEntity, Integer> {

    @Query("""
            SELECT rp.permissionId
            FROM RolePermissionEntity rp
            WHERE rp.roleId IN :roleIds
            """)
    List<Integer> findPermissionIdsByRoleIds(List<Integer> roleIds);
    List<RolePermissionEntity> findByRoleId(Integer roleId);

    void deleteByRoleId(Integer roleId);
}

