package com.example.main_service.rbac.repo;

import com.example.main_service.rbac.model.RoleEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleRepo extends JpaRepository<RoleEntity, Integer> {

    @Query("SELECT r.roleId FROM RoleEntity r WHERE r.roleName = :name")
    Integer findRoleIdByName(String name);
}
