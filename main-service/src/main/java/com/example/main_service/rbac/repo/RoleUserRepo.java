package com.example.main_service.rbac.repo;

import com.example.main_service.rbac.model.RoleUserEntity;
import org.springframework.data.jpa.repository.Modifying;
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
    List<Integer> findRoleIds(Long userId, RoleUserEntity.ScopeType scopeType , String scopeId);

    @Modifying
    @Query(
            value = "INSERT INTO role_user (role_id, user_id, scope_id, scope_type) " +
                    "VALUES (:roleId, :userId, :scopeId, :scopeType)",
            nativeQuery = true
    )
    void insertRoleUser(Integer roleId, Long userId, String scopeId, String scopeType);

    @Query("""
    SELECT r.roleName
    FROM RoleUserEntity ru
    LEFT JOIN RoleEntity r ON ru.roleId = r.roleId
    WHERE ru.userId = :userId
      AND (
            (ru.scopeType = :contestScopeType AND ru.scopeId = :contestId)
      )
""")
    List<String> findUserRolesForContest(
            Long userId,
            RoleUserEntity.ScopeType contestScopeType,
            String contestId,
            RoleUserEntity.ScopeType systemScopeType
    );

    boolean existsByUserIdAndRoleIdAndScopeIdAndScopeType(
            Long userId,
            Long roleId,
            String scopeId,
            RoleUserEntity.ScopeType scopeType
    );
}
