package com.example.main_service.dashboard.dtos;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContestRatingCalcResponseDto {

    private Long contest_id;
    private boolean updated;
    private int affected_users;
}
