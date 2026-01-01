package com.example.main_service.contest.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contest_problem")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestProblemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contest_id")
    private Long contestId;

    @Column(name = "problem_id")
    private String problemId;

    @Column(name = "problem_label")
    private String problemLabel;

    @Column(name = "problem_order")
    private Integer problemOrder;
}
