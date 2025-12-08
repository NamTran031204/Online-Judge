package com.example.main_service.contest.service.impl;

import com.example.main_service.contest.exceptions.ErrorCode;
import com.example.main_service.contest.exceptions.specException.ContestBusinessException;
import com.example.main_service.contest.model.ContestEntity;
import com.example.main_service.contest.repo.ContestParticipantsRepo;
import com.example.main_service.contest.service.StatusChangeService;
import com.example.main_service.sharedAttribute.enums.ContestStatus;
import com.example.main_service.sharedAttribute.enums.ContestType;
import com.example.main_service.sharedAttribute.enums.ContestVisibility;
import com.example.main_service.sharedAttribute.enums.InviteStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service nay phuc vu viec VALIDATE mot status nao do cua Contest co duoc phep thay doi hay khong
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class StatusChangeServiceImpl implements StatusChangeService {

    private final ContestParticipantsRepo contestParticipantsRepo;

    /**
     * Validate Visibility PUBLIC <-> PRIVATE
     * I. PUBLIC -> PRIVATE
     * *. contest khong co participant -> return visibility (hien tai logic la author khong phai participant)
     * 1. check status: contest o trang thai UPCOMING
     * 2. check type: neu o trang thai Official thi khong cho thay doi
     * II. PRIVATE -> PUBLIC
     * 1. status UPCOMING -> ok
     * 2. status RUNNING -> block
     * 3. status FINISHED
     *      a. type GYM -> ok
     *      b. type DRAFT -> block, vi draf co tinh diem
     *      c. type OFFICIAL -> thuong khong xay ra, nhung xay ra thi block
     * @param visibility
     * @param contest
     * @return
     */
    @Override
    public ContestVisibility changeContestVisibility(ContestVisibility visibility, ContestEntity contest) {
        if (contest.getVisibility() == visibility) {
            return visibility;
        }

        if (visibility == ContestVisibility.PRIVATE) {
            if (!contestParticipantsRepo.existsByContestId(contest.getContestId())) {
                return visibility;
            }
            if (contest.getContestStatus() != ContestStatus.UPCOMING) {
                throw new ContestBusinessException(ErrorCode.CONTEST_VISIBILITY_CHANGE_FAIL);
            }
            if (contest.getContestType() == ContestType.OFFICIAL) {
                throw new ContestBusinessException(ErrorCode.CONTEST_VISIBILITY_CHANGE_FAIL);
            }
        } else {
            if (contest.getContestStatus() == ContestStatus.UPCOMING) {
                return visibility;
            }
            if (contest.getContestStatus() == ContestStatus.RUNNING) {
                throw new ContestBusinessException(ErrorCode.CONTEST_VISIBILITY_CHANGE_FAIL);
            }

            if (contest.getContestType() == ContestType.GYM) {
                return visibility;
            }
            if (contest.getContestType() == ContestType.DRAFT || contest.getContestType() == ContestType.OFFICIAL) {
                throw new ContestBusinessException(ErrorCode.CONTEST_VISIBILITY_CHANGE_FAIL);
            }
        }

        return visibility;
    }

    /**
     * doi thi cu doi binh thuong thoi
     * @param status
     * @param contest
     * @return
     */
    @Override
    public ContestStatus changeContestStatus(ContestStatus status, ContestEntity contest) {

        return status;
    }

    /**
     * TODO: implement nghiep vu cho change ContestType: Draft <-> Gym <-> Official
     * @param type
     * @param contest
     * @return
     */
    @Override
    public ContestType changeContestType(ContestType type, ContestEntity contest) {

        return type;
    }

    /**
     * TODO: implement nghiep vu cho change InviteStatus
     * @param status
     * @param contest
     * @return
     */
    @Override
    public InviteStatus changeInviteStatus(InviteStatus status, ContestEntity contest) {
        return status;
    }
}
