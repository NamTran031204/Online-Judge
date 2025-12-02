package com.example.main_service.contest.service.impl;

import com.example.main_service.contest.dto.userContest.ContestRegistrationResponseDto;
import com.example.main_service.contest.exceptions.ErrorCode;
import com.example.main_service.contest.exceptions.specException.ContestBusinessException;
import com.example.main_service.contest.model.ContestRegistrationEntity;
import com.example.main_service.contest.repo.ContestRegistrationRepo;
import com.example.main_service.contest.repo.ContestRepo;
import com.example.main_service.contest.service.UserContestService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class UserContestServiceImpl implements UserContestService {

    private final ContestRepo contestRepo;
    private final ContestRegistrationRepo contestRegistrationRepo;

    @Override
    public ContestRegistrationResponseDto registerUser(Long contestId) {

        if (contestRepo.existsById(contestId)) {
            throw new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND);
        }

        // TODO: lay ra userId tu UserDetail
        ContestRegistrationEntity entity = contestRegistrationRepo.save(ContestRegistrationEntity.builder()
                        .contestId(contestId)
                        .userId(1L)
                .build());
        ContestRegistrationResponseDto response = ContestRegistrationResponseDto.builder()
                .contestId(entity.getContestId())
                .userId(entity.getUserId())
                .registeredAt(entity.getRegisteredAt())
                .build();
        return response;
    }
}
