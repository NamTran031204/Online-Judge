package com.example.main_service.user.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_rating_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRatingHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "contest_id", nullable = false)
    private Long contestId;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "delta", nullable = false)
    private Integer delta;
}

