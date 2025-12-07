package com.example.main_service.rbac.repo;

import com.example.main_service.rbac.model.PermissionEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermissionRepo extends JpaRepository<PermissionEntity, Integer> {

    @Query("SELECT p.permissionName FROM PermissionEntity p WHERE p.permissionId IN :ids")
    List<String> findPermissionNamesByIds(List<Integer> ids);
}
