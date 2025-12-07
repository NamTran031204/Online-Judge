package com.example.main_service.rbac.repo;

import com.example.main_service.rbac.model.RoleEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleRepo extends JpaRepository<RoleEntity, Integer> {

    @Query("SELECT r.roleName FROM RoleEntity r WHERE r.roleId IN :ids")
    List<String> findRoleNamesByIds(List<Integer> ids);
}
