package com.example.main_service.rbac.repo;

import com.example.main_service.rbac.model.RoleEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepo extends JpaRepository<RoleEntity, Integer> {

    @Query("SELECT r.roleId FROM RoleEntity r WHERE r.roleName = :name")
    Integer findRoleIdByName(String name);
}
