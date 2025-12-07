package com.example.main_service.rbac.repo;

import com.example.main_service.rbac.model.RoleUserEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RoleUserRepo extends CrudRepository<RoleUserEntity, Integer> {

    @Query("""
            SELECT ru.roleId
            FROM RoleUserEntity ru
            WHERE ru.userId = :userId
              AND ru.scopeType = :scopeType
              AND ru.scopeId = :scopeId
            """)
    List<Integer> findRoleIds(Long userId, RoleUserEntity.ScopeType scopeType , Long scopeId);
}
