package com.example.main_service.rbac.model;

import jakarta.persistence.*;
import lombok.Builder;

@Entity
@Table(name = "role_user")
@Builder

public class RoleUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // khóa chính mới

    @Column(name = "role_id", nullable = false)
    private Integer roleId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "scope_id")
    private String scopeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "scope_type", nullable = false)
    private ScopeType scopeType;

    public enum ScopeType {
        System,
        Contest,
        Problem,
        Group
    }
}
