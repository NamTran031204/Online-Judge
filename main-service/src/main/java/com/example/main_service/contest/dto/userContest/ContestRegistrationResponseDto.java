package com.example.main_service.contest.dto.userContest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContestRegistrationResponseDto {
    @JsonProperty("contest_id")
    private Long contestId;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("registered_at")
    private LocalDateTime registeredAt;
}
