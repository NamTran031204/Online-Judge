package com.example.main_service.contest.service.impl;

import com.example.main_service.contest.dto.contest.ContestAttachProblemRequestDto;
import com.example.main_service.contest.dto.contestProblem.ContestProblemResponseDto;
import com.example.main_service.contest.model.ContestEntity;
import com.example.main_service.contest.model.ContestProblemEntity;
import com.example.main_service.contest.repo.ContestProblemRepo;
import com.example.main_service.contest.repo.ContestRepo;
import com.example.main_service.contest.service.ContestProblemService;
import com.example.main_service.problem.ProblemGrpcClient;
import com.example.main_service.sharedAttribute.enums.ContestType;
import com.example.main_service.sharedAttribute.exceptions.ErrorCode;
import com.example.main_service.sharedAttribute.exceptions.specException.ContestBusinessException;
import com.example.proto.ValidateAndCloneProblemResponse;
import io.grpc.StatusRuntimeException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContestProblemServiceImpl implements ContestProblemService {

    private final ContestRepo contestRepo;
    private final ContestProblemRepo contestProblemRepo;
    private final ProblemGrpcClient problemGrpcClient;

    @Override
    @Transactional(rollbackOn = Exception.class)
    public ContestProblemResponseDto addProblemToContest(
            Long userId,
            Long contestId,
            ContestAttachProblemRequestDto input
    ) {
        requireUser(userId);
        if (contestId == null) throw new ContestBusinessException(ErrorCode.CONTEST_VALIDATION_ERROR);
        if (input == null || input.getProblemId() == null)
            throw new ContestBusinessException(ErrorCode.CONTEST_VALIDATION_ERROR);

        ContestEntity contest = getContestOrThrow(contestId);
        //ensureDraft(contest);

        ValidateAndCloneProblemResponse grpcResp = validateAndCloneProblem(userId, contestId, input.getProblemId());

        int nextOrder = contestProblemRepo.findMaxOrderByContestId(contestId).orElse(0) + 1;

        ContestProblemEntity entity = contestProblemRepo.save(
                ContestProblemEntity.builder()
                        .contestId(contestId)
                        .problemId(grpcResp.getNewProblemId())
                        .problemLabel(input.getProblemLabel())
                        .problemOrder(nextOrder)
                        .build()
        );

        return ContestProblemResponseDto.builder()
                .contestId(contestId)
                .problemId(entity.getProblemId())
                .problemLabel(entity.getProblemLabel())
                .problemOrder(entity.getProblemOrder())
                .build();
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void deleteProblemFromContest(Long userId, Long contestId, String problemId) {
        requireUser(userId);
        if (contestId == null || problemId == null)
            throw new ContestBusinessException(ErrorCode.CONTEST_VALIDATION_ERROR);

        ContestEntity contest = getContestOrThrow(contestId);
        ensureDraft(contest);

        ContestProblemEntity entity = contestProblemRepo
                .findByContestIdAndProblemId(contestId, problemId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_PROBLEM_NOT_FOUND));

        // grpc delete (raw)
        problemGrpcClient.deleteProblem(problemId);

        contestProblemRepo.delete(entity);
    }

    @Override
    @Transactional
    public void reArrangeProblem(Long userId, Long contestId, List<String> problemIds) {
        requireUser(userId);
        if (contestId == null || problemIds == null)
            throw new ContestBusinessException(ErrorCode.CONTEST_VALIDATION_ERROR);

        ContestEntity contest = getContestOrThrow(contestId);
        ensureDraft(contest);

        int order = 1;
        for (String problemId : problemIds) {
            contestProblemRepo.updateProblemOrder(contestId, problemId, order++);
        }
    }

    private ValidateAndCloneProblemResponse validateAndCloneProblem(Long userId, Long contestId, String problemId) {
        try {
            ValidateAndCloneProblemResponse response =
                    problemGrpcClient.validateAndCloneProblem(userId, contestId, problemId);

            if (!response.getSuccess()) {
                throw new ContestBusinessException(ErrorCode.CONTEST_PROBLEM_ERROR);
            }
            return response;

        } catch (StatusRuntimeException e) {
            switch (e.getStatus().getCode()) {
                case NOT_FOUND:
                    throw new ContestBusinessException(
                            ErrorCode.PROBLEM_NOT_FOUND,
                            e.getStatus().getDescription()
                    );
                case FAILED_PRECONDITION:
                    throw new ContestBusinessException(
                            ErrorCode.CONTEST_PROBLEM_ERROR,
                            e.getStatus().getDescription()
                    );
                default:
                    throw new ContestBusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
            }
        }
    }

    // =========================
    // helpers
    // =========================
    private void requireUser(Long userId) {
        if (userId == null || userId == 0) {
            throw new ContestBusinessException(ErrorCode.CONTEST_VALIDATION_ERROR, "Khong biet user la ai");
        }
    }

    private ContestEntity getContestOrThrow(Long contestId) {
        return contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));
    }

    private void ensureDraft(ContestEntity contest) {
        if (contest.getContestType() != ContestType.DRAFT) {
            throw new ContestBusinessException(ErrorCode.CONTEST_VALIDATION_ERROR, "Contest k phải draft");
        }
    }
}
