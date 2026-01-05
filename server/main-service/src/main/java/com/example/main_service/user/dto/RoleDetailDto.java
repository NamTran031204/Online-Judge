package com.example.main_service.user.dto;

import lombok.Data;

import java.util.List;

@Data
public class RoleDetailDto {
    private Integer roleId;
    private String roleCode;
    private String roleName;
    private List<PermissionDto> permissions;
}

