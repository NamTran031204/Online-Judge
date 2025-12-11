package com.example.main_service.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDetailDto {
    private Long userId;
    private String userName;
    private String email;
    private String info;
}
