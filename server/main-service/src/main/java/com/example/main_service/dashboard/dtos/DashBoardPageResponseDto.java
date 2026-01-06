package com.example.main_service.dashboard.dtos;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashBoardPageResponseDto {

    private Long total;

    private List<DashBoardItemResponseDto> items;
}

