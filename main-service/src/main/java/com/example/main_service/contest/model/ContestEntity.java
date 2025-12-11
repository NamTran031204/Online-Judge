package com.example.main_service.contest.model;

import com.example.main_service.sharedAttribute.enums.ContestStatus;
import com.example.main_service.sharedAttribute.enums.ContestType;
import com.example.main_service.sharedAttribute.enums.ContestVisibility;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "contest")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestEntity {

    @Id
    @Column(name = "contest_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contestId;

    private String title;
    private String description;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    private Integer duration;

    @Column(name = "contest_status")
    @Enumerated(EnumType.STRING)
    private ContestStatus contestStatus;

    @Column(name = "contest_type")
    @Enumerated(EnumType.STRING)
    private ContestType contestType;

    private Long author;
    private Long rated;

    @Enumerated(EnumType.STRING)
    private ContestVisibility visibility;

    @Column(name = "group_id")
    private Long groupId;

    public boolean isExpired() {
        if (startTime == null || duration == null) {
            return false; // contest chưa có thời gian thì không expired
        }
        LocalDateTime endTime = startTime.plusMinutes(duration);
        return LocalDateTime.now().isAfter(endTime);
    }
}
