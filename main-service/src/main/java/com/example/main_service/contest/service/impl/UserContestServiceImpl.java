package com.example.main_service.contest.service.impl;

import com.example.main_service.contest.dto.userContest.ContestParticipantFilterDto;
import com.example.main_service.contest.dto.userContest.ContestParticipantResponseDto;
import com.example.main_service.contest.dto.userContest.ContestRegistrationFilterDto;
import com.example.main_service.contest.dto.userContest.ContestRegistrationResponseDto;
import com.example.main_service.contest.service.ContestService;
import com.example.main_service.rbac.RoleService;
import com.example.main_service.sharedAttribute.exceptions.ErrorCode;
import com.example.main_service.sharedAttribute.exceptions.specException.ContestBusinessException;
import com.example.main_service.contest.model.ContestEntity;
import com.example.main_service.contest.model.ContestParticipantsEntity;
import com.example.main_service.contest.model.ContestRegistrationEntity;
import com.example.main_service.contest.repo.ContestParticipantsRepo;
import com.example.main_service.contest.repo.ContestRegistrationRepo;
import com.example.main_service.contest.repo.ContestRepo;
import com.example.main_service.contest.repo.projections.ContestParticipantProjection;
import com.example.main_service.contest.repo.projections.ContestRegistrationProjection;
import com.example.main_service.contest.service.UserContestService;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.sharedAttribute.enums.ContestType;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.example.main_service.rbac.RbacService.getUserIdFromToken;

@Service
@Transactional
@RequiredArgsConstructor
public class UserContestServiceImpl implements UserContestService {

    private final ContestRepo contestRepo;
    private final ContestService contestService;
    private final ContestRegistrationRepo contestRegistrationRepo;
    private final ContestParticipantsRepo contestParticipantsRepo;
    private final RoleService roleService;   // thêm vào để check role

    @Override
    public ContestRegistrationResponseDto registerUser(Long contestId) {

        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));

        // TODO: lay ra userId tu UserDetail
        Long userId = getUserIdFromToken();
        if (userId == null || userId == 0)
            throw new ContestBusinessException(ErrorCode.USER_NOT_FOUND);

        if (contestService.isContestFinished(contestId)) {
            throw new ContestBusinessException(ErrorCode.CONTEST_ENDED);
        }
        boolean isSpecial = roleService.hasSpecialContestRole(userId,contestId); // theo scope

        //draft contest chỉ tester và admin động vào
        if (!isSpecial && contest.getContestType().equals(ContestType.DRAFT)) {
                throw new ContestBusinessException(ErrorCode.CONTEST_ACCESS_DENY);
        }
        if(isSpecial && (contest.getContestType().equals(ContestType.GYM) || contest.getContestType().equals(ContestType.OFFICIAL)) ) {
            throw new ContestBusinessException(ErrorCode.CONTEST_ACCESS_DENY);
        }
        if (contestRegistrationRepo.existsByContestIdAndUserId(contestId, userId)) {
            throw new ContestBusinessException(ErrorCode.CONTEST_ALREADY_REGISTERED);
        }

        ContestRegistrationEntity entity = contestRegistrationRepo.save(ContestRegistrationEntity.builder()
                        .contestId(contestId)
                        .userId(userId)
                .build());
        contestParticipantsRepo.save(ContestParticipantsEntity.builder()
                        .contestId(contestId)
                        .userId(userId)
                        .ranking(0)
                        .penalty(0)
                        .totalScore(0)
                .build());
        ContestRegistrationResponseDto response = ContestRegistrationResponseDto.builder()
                .contestId(entity.getContestId())
                .userId(entity.getUserId())
                .registeredAt(entity.getRegisteredAt())
                .build();
        return response;
    }

    @Override
    public PageResult<ContestRegistrationResponseDto> getRegistration(Long contestId, PageRequestDto<ContestRegistrationFilterDto> input) {

        Page<ContestRegistrationProjection> data;
        if (input.getFilter() != null) {
            data = contestRegistrationRepo.findByContestIdAndUserId(
                    contestId, input.getFilter().getUserId(), input.getPageRequest());
        } else {
            data = contestRegistrationRepo.findByContestId(contestId, input.getPageRequest());
        }

        PageResult<ContestRegistrationResponseDto> result = new PageResult<>();
        result.setTotalCount(data.getTotalElements());

        List<ContestRegistrationResponseDto> dataResult = data.map(projection -> ContestRegistrationResponseDto.builder()
                        .contestId(projection.getContestId())
                        .userId(projection.getUserId())
                        .userName(projection.getUserName())
                        .registeredAt(projection.getRegisteredAt())
                        .build())
                .getContent();

        result.setData(dataResult);

        return result;
    }

    // TODO: lam dashboard thi chinh lai api nay
    @Override
    public PageResult<ContestParticipantResponseDto> getParticipants(Long contestId, PageRequestDto<ContestParticipantFilterDto> input) {
        //TODO: lay ra userId tu Spring Sec
        Long execUserId = getUserIdFromToken();
        checkUserInContest(execUserId, contestId);

        Page<ContestParticipantProjection> data;

        if (input.getFilter() != null) {
            data = contestParticipantsRepo.findByContestIdAndUserId(contestId, input.getFilter().getUserId(), input.getPageRequest());
        } else {
            data = contestParticipantsRepo.findByContestId(contestId, input.getPageRequest());
        }
        PageResult<ContestParticipantResponseDto> result = new PageResult<>();
        result.setTotalCount(data.getTotalElements());

        List<ContestParticipantResponseDto> dataResult = data.map(projection -> ContestParticipantResponseDto.builder()
                        .contestId(projection.getContestId())
                        .userId(projection.getUserId())
                        .userName(projection.getUserName())
                        .penalty(projection.getPenalty())
                        .totalScore(projection.getTotalScore())
                        .ranking(projection.getRanking())
                        .build())
                        .getContent();

        result.setData(dataResult);

        return result;
    }

    void checkUserInContest(Long execUserId, Long contestId) {
        boolean isSpecial = roleService.hasSpecialContestRole(execUserId, contestId);
        if (isSpecial) return;
        if (!contestRegistrationRepo.existsByContestIdAndUserId(contestId, execUserId)) {
            throw new ContestBusinessException(ErrorCode.CONTEST_ACCESS_DENY);
        }
    }
}
