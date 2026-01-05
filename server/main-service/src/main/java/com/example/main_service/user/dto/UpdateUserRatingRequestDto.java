package com.example.main_service.user.dto;

import lombok.Data;

@Data
public class UpdateUserRatingRequestDto {
    private Integer rating;
    private String reason; // optional, để audit
}

