package com.example.main_service.submission;

import com.example.main_service.contest.model.ContestEntity;
import com.example.main_service.contest.repo.ContestRepo;
import com.example.main_service.contest.service.ContestService;
import com.example.main_service.dashboard.service.DashBoardService;
import com.example.main_service.problem.ProblemService;
import com.example.main_service.problem.dto.ProblemEntity;
import com.example.main_service.rbac.RbacService;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.sharedAttribute.exceptions.ErrorCode;
import com.example.main_service.sharedAttribute.exceptions.specException.ContestBusinessException;
import com.example.main_service.submission.dto.SubmissionEntity;
import com.example.main_service.submission.dto.SubmissionInputDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionGrpcClient submissionGrpcClient;
    private final ContestService contestService;
    private final ContestRepo contestRepo;
    private final DashBoardService dashBoardService;
    private final ProblemService problemService;
    private final RbacService rbacService;

    public SubmissionEntity submit(Long userId, SubmissionInputDto input) {
        if (input == null) throw new ContestBusinessException(ErrorCode.CONTEST_VALIDATION_ERROR);

        // set userId
        input.setUserId(userId);

        ProblemEntity problem = problemService.getProblemById(userId, input.getProblemId());
        if (problem == null) throw new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND);

        Long contestId = problem.getContestId();
        input.setContestId(contestId);

        if (!contestService.canUserSubmit(contestId, userId)) {
            throw new ContestBusinessException(ErrorCode.CONTEST_ACCESS_DENY, "User cannot submit");
        }

        // call grpc
        SubmissionEntity submission = submissionGrpcClient.submit(input);
        if (submission == null) return null;

        // check contest running
        if (contestId != null && contestService.isContestRunning(contestId)) {
            // dashboard hook
            dashBoardService.onSubmissionJudged(
                    submission.getSubmissionId(),
                    submission.getUserId(),
                    submission.getContestId(),
                    submission.getProblemId(),
                    submission.isAllAccepted(),
                    submission.getSubmittedAt().atZone(ZoneId.systemDefault()).toEpochSecond()
            );
        }

        return submission;
    }

    public PageResult<SubmissionEntity> getPage(Long userId, PageRequestDto<SubmissionInputDto> pageRequest) {
        PageResult<SubmissionEntity> page = submissionGrpcClient.getPage(pageRequest);
        return filterSubmissionPage(userId, page);
    }

    public SubmissionEntity getById(Long userId, String submissionId) {
        SubmissionEntity s = submissionGrpcClient.getById(submissionId);
        return filterSubmission(userId, s);
    }

    // private helpers

    private PageResult<SubmissionEntity> filterSubmissionPage(Long userId, PageResult<SubmissionEntity> page) {
        if (page == null || page.getData() == null) return page;

        if (rbacService.isAdmin(userId)) return page;

        // gom contestIds để query 1 phát
        Set<Long> contestIds = page.getData().stream()
                .map(SubmissionEntity::getContestId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<Long, ContestEntity> contestMap = contestIds.isEmpty()
                ? Map.of()
                : contestRepo.findAllById(contestIds).stream()
                .collect(Collectors.toMap(ContestEntity::getContestId, Function.identity()));

        List<SubmissionEntity> filtered = page.getData().stream()
                .filter(s -> canViewSubmission(userId, s, contestMap))
                .toList();

        page.setData(filtered);
        return page;
    }

    private SubmissionEntity filterSubmission(Long userId, SubmissionEntity s) {
        if (s == null) return null;
        if (rbacService.isAdmin(userId)) return s;

        Long contestId = s.getContestId();
        ContestEntity contest = (contestId == null) ? null : contestRepo.findById(contestId).orElse(null);

        boolean ok = canViewSubmission(userId, s, contest == null ? Map.of() : Map.of(contestId, contest));
        return ok ? s : null;
    }

    private boolean canViewSubmission(Long userId, SubmissionEntity s, Map<Long, ContestEntity> contestMap) {
        if (s == null) return false;

        // owner submission xem được
        if (s.getUserId() != null && s.getUserId().equals(userId)) return true;

        Long contestId = s.getContestId();
        if (contestId == null) return false;

        ContestEntity contest = contestMap.get(contestId);
        if (contest == null) return false;

        // contest author xem được
        return contest.getAuthor() != null && contest.getAuthor().equals(userId);
    }
}
