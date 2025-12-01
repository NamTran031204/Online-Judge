package com.example.main_service.contest.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contest_invitation")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestInvitationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inviteId;

    @Column(name = "contest_id")
    private Long contestId;

    @Column(name = "inviter_id")
    private Long inviterId;

    @Column(name = "invitee_id")
    private Long inviteeId;


}
