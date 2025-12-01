package com.example.main_service.contest.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contest_participants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestParticipantsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contest_id")
    private Long contestId;

    @Column(name = "user_id")
    private Long userId;

    private Integer penalty;

    @Column(name = "total_score")
    private Integer totalScore;

    private Integer rank;
}
