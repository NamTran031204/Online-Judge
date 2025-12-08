package com.example.main_service.contest.service.impl;

import com.example.main_service.contest.dto.contest.PromoteDraftToGymRequestDto;
import com.example.main_service.contest.dto.contest.PromoteDraftToGymResponseDto;
import com.example.main_service.contest.dto.userContest.ContestParticipantFilterDto;
import com.example.main_service.contest.dto.userContest.ContestParticipantResponseDto;
import com.example.main_service.contest.dto.userContest.ContestRegistrationFilterDto;
import com.example.main_service.contest.dto.userContest.ContestRegistrationResponseDto;
import com.example.main_service.contest.exceptions.ErrorCode;
import com.example.main_service.contest.exceptions.specException.ContestBusinessException;
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

@Service
@Transactional
@RequiredArgsConstructor
public class UserContestServiceImpl implements UserContestService {

    private final ContestRepo contestRepo;
    private final ContestRegistrationRepo contestRegistrationRepo;
    private final ContestParticipantsRepo contestParticipantsRepo;

    /**
     * save registration dong thoi save participant phuc vu tinh diem
     * @param contestId
     * @return
     */
    @Override
    public ContestRegistrationResponseDto registerUser(Long contestId) {

        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));

        // TODO: lay ra userId tu UserDetail
        Long userId = 1L;

        // neu user co role User thi khong duoc dang ky tham gia contest draft tru khi la author
        if (contest.getContestType().equals(ContestType.DRAFT) && userId == 2L) {
            if (!contest.getAuthor().equals(userId))
                throw new ContestBusinessException(ErrorCode.CONTEST_ACCESS_DENY);
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
        // TODO: lay ra userId tu Spring Security
        Long execUserId = 1L;
        checkValidateExecUser(execUserId, contestId);

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
        Long execUserId = 1L;
        checkValidateExecUser(execUserId, contestId);

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

    void checkValidateExecUser(Long execUserId, Long contestId) {
        if (contestRepo.existsByAuthor(execUserId)) {
            return;
        }
        if (!contestRegistrationRepo.existsByContestIdAndUserId(contestId, execUserId)) {
            throw new ContestBusinessException(ErrorCode.CONTEST_ACCESS_DENY);
        }
    }
}
