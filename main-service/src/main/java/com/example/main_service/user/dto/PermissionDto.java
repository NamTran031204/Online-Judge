package com.example.main_service.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data

public class PermissionDto {
    Integer permission_id;
    String permission_name;
}
