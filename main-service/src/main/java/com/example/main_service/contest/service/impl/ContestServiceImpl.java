package com.example.main_service.contest.service.impl;

import com.example.main_service.contest.repo.ContestProblemRepo;
import com.example.main_service.contest.repo.ContestRegistrationRepo;
import com.example.main_service.contest.service.StatusChangeService;
import com.example.main_service.rbac.RbacService;
import com.example.main_service.rbac.model.RoleUserEntity;
import com.example.main_service.rbac.repo.RoleUserRepo;
import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.contest.dto.contest.*;
import com.example.main_service.sharedAttribute.enums.ContestStatus;
import com.example.main_service.sharedAttribute.enums.ContestType;
import com.example.main_service.sharedAttribute.enums.ContestVisibility;
import com.example.main_service.sharedAttribute.exceptions.ErrorCode;
import com.example.main_service.sharedAttribute.exceptions.specException.ContestBusinessException;
import com.example.main_service.contest.model.ContestEntity;
import com.example.main_service.contest.repo.ContestRepo;
import com.example.main_service.contest.service.ContestService;
import com.example.main_service.contest.specification.ContestSpec;
import com.example.main_service.contest.utils.StringUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static com.example.main_service.rbac.RbacService.getUserIdFromToken;

@Service
@Transactional
@RequiredArgsConstructor
public class ContestServiceImpl implements ContestService {

    private final ContestRepo contestRepo;
    private final StatusChangeService statusChangeService;
    private final RbacService rbacService;
    private final ContestRegistrationRepo contestRegistrationRepo;

    @Override
    @Transactional(rollbackOn = Exception.class)
    public ContestCreateUpdateResponseDto createContest(ContestCreateUpdateRequestDto input) {
        contestCreateUpdateValidate(input, "create");
        input.setContestType(ContestType.DRAFT);
        input.setVisibility(ContestVisibility.PRIVATE);

        Long userId = getUserIdFromToken();
        if(userId==0) throw new ContestBusinessException(ErrorCode.CONTEST_VALIDATION_ERROR, "Khong biet author la ai");

        ContestEntity entity = ContestEntity.builder()
                .title(input.getTitle())
                .description(input.getDescription())
                .startTime(input.getStartTime())
                .duration(input.getDuration())
                .contestStatus(ContestStatus.UPCOMING)
                .contestType(input.getContestType())
                .author(userId)
                .rated(input.getRated())
                .visibility(input.getVisibility())
                .groupId(input.getGroupId())
                .build();

        ContestEntity savedEntity = contestRepo.save(entity);
        rbacService.assignRole(userId,"Author","Contest", String.valueOf(savedEntity.getContestId()));

        ContestCreateUpdateResponseDto responseDto = new ContestCreateUpdateResponseDto();
        responseDto.setContestId(savedEntity.getContestId());

        return responseDto;
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public ContestCreateUpdateResponseDto updateContest(Long contestId, ContestCreateUpdateRequestDto input) {
        contestCreateUpdateValidate(input, "update");
        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));

        validateUpdatePermission(contest);

        if (StringUtils.isNotNullOrBlank(input.getTitle()))
            contest.setTitle(input.getTitle());
        if (StringUtils.isNotNullOrBlank(input.getDescription()))
            contest.setDescription(input.getDescription());
        if (input.getStartTime() != null)
            contest.setStartTime(input.getStartTime());
        if (input.getDuration() != null)
            contest.setDuration(input.getDuration());
        if (input.getGroupId() != null)
            contest.setGroupId(input.getGroupId());

        contestRepo.save(contest);
        return ContestCreateUpdateResponseDto.builder()
                .contestId(contest.getContestId())
                .build();
    }

    @Override
    public PageResult<ContestEntity> search(PageRequestDto<ContestFilterDto> input) {
        try {
            var filter = input.getFilter();
            Specification<ContestEntity> spec;
            if (filter == null) {
                spec = Specification.where(
                        ((root, query, criteriaBuilder) -> criteriaBuilder.greaterThanOrEqualTo(root.get("rated"), 0L))
                );
            } else {
                if (filter.getRated() == null) filter.setRated(0L);

                spec = Specification.where(ContestSpec.hasRated(filter.getRated()));

                if (filter.getContestStatus() != null) {
                    spec.and(ContestSpec.hasContestStatus(filter.getContestStatus()));
                }
                if (filter.getContestType() != null) {
                    spec.and(ContestSpec.hasContestType(filter.getContestType()));
                }

                // groupId va authorId anh huong den Visibility
                if (filter.getGroupId() != null) {
                    spec.and(ContestSpec.hasGroupId(filter.getGroupId()));
                }
                if (filter.getAuthorId() != null) {
                    spec.and(ContestSpec.hasAuthorId(filter.getAuthorId()));
                }

                /**
                 * TODO: neu da phat trien GROUP, request nay can validate get contest by visibility
                 */
                if (filter.getVisibility() == null) {
                    if (filter.getAuthorId() != null) {
                        Long userId = 1L; // TODO: lay ra userId tu UserDetail
                        if (!userId.equals(filter.getAuthorId())) {
                            spec.and(ContestSpec.hasVisibility(ContestVisibility.PUBLIC));
                        }
                    }
                    // neu dap ung dieu kien: hoac la author, hoac la nguoi tham gia, thi co the xem tat ca contest PUBLIC/PRIVATE
                } else {
                    spec.and(ContestSpec.hasVisibility(filter.getVisibility()));
                }
            }

            var pageResult = contestRepo.findAll(spec, input.getPageRequest());
            PageResult<ContestEntity> result = new PageResult<>();
            result.setData(pageResult.getContent());
            result.setTotalCount(pageResult.getTotalElements());
            return result;
        } catch (Exception e) {
            throw new ContestBusinessException(ErrorCode.CONTEST_ERROR);
        }
    }

    @Override
    public ContestDetailDto getById(Long contestId) {
        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));

        if (contest.getVisibility().equals(ContestVisibility.PRIVATE)) {
            Long userId = getUserIdFromToken();
            boolean ok = true;
            if (!contest.getAuthor().equals(userId)) {
                ok = false;
            }
            // validate group
            if (!ok) {
                throw new ContestBusinessException(ErrorCode.CONTEST_ACCESS_DENY);
            }
        }

        ContestSummaryDto contestSummaryDto = ContestSummaryDto.builder()
                .contestId(contest.getContestId())
                .title(contest.getTitle())
                .description(contest.getDescription())
                .startTime(contest.getStartTime())
                .duration(contest.getDuration())
                .contestType(contest.getContestType())
                .contestStatus(contest.getContestStatus())
                .authorId(contest.getAuthor())
                .rated(contest.getRated())
                .visibility(contest.getVisibility())
                .build();

        List<Long> problemList = new ArrayList<>(); //đọc từ contest problem

        ContestDetailDto response = ContestDetailDto.builder()
                .problems(problemList)
                .build();
        BeanUtils.copyProperties(contestSummaryDto, response);
        return response;
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void deleteContest(Long contestId) {
        if (contestId == null) throw new ContestBusinessException(ErrorCode.CONTEST_ERROR);
        if(!isContestUpcoming(contestId)) throw new ContestBusinessException(ErrorCode.CONTEST_ERROR);
        contestRepo.deleteById(contestId);
    }

    @Override
    public PromoteDraftToGymResponseDto promoteDraft(Long contestId, PromoteDraftToGymRequestDto input) {

        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));

        if (!contest.getContestType().equals(ContestType.DRAFT)) {
            return PromoteDraftToGymResponseDto.builder()
                    .contestId(contestId)
                    .newType(contest.getContestType())
                    .approved(false)
                    .visibility(contest.getVisibility())
                    .message("Contest cannot be change Type")
                    .build();
        }

        if (contest.getVisibility().equals(ContestVisibility.PUBLIC)) {
            throw new ContestBusinessException(ErrorCode.CONTEST_ERROR, "Contest face Error");
        }

        contest.setContestType(ContestType.GYM);
        contest.setVisibility(ContestVisibility.PUBLIC);
        contestRepo.save(contest);

        return PromoteDraftToGymResponseDto.builder()
                .contestId(contestId)
                .newType(contest.getContestType())
                .approved(true)
                .visibility(contest.getVisibility())
                .message("Contest is now public in Gym")
                .build();
    }

    @Override
    public Boolean isContestRunning(Long contestId) {
        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));

        LocalDateTime now = LocalDateTime.now();
        return contest.getStartTime().isBefore(now)
                && contest.getEndTime().isAfter(now);
    }

    @Override
    public Boolean isContestPublic(Long contestId) {
        return contestRepo.findById(contestId)
                .map(c -> c.getVisibility().equals(ContestVisibility.PUBLIC))
                .orElse(false);
    }

    @Override
    public Boolean isUserRegistered(Long contestId, Long userId) {
        return contestRegistrationRepo.existsByContestIdAndUserId(contestId, userId);
    }

    @Override
    public Boolean isContestFinished(Long contestId) {
        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));

        LocalDateTime endTime = contest.getStartTime().plusSeconds(contest.getDuration());
        return LocalDateTime.now().isAfter(endTime);
    }

    @Override
    public Boolean isContestUpcoming(Long contestId) {
        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));
        return LocalDateTime.now().isBefore(contest.getStartTime());
    }

    @Override
    public Boolean canUserSubmit(Long contestId, Long userId) {
        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found"));

        if (Boolean.TRUE.equals(isContestPublic(contestId))) {
            return true;
        }

        return contestRegistrationRepo
                .existsByContestIdAndUserId(contestId, userId);
    }

    @Override
    public Long getContestStartTime(Long contestId) {
        return contestRepo.findById(contestId)
                .orElseThrow()
                .getStartTime()
                .atZone(ZoneId.systemDefault())
                .toEpochSecond();
    }

    ContestProblemRepo contestProblemRepo;
    @Override
    @Transactional
    public void assignReviewer(Long contestId, Long reviewerId) {

        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));

        // 3. Gán quyền contest:view
        rbacService.assignRole(
                reviewerId,
                "AUTHOR",
                "Contest",
                contestId.toString()
        );

        // 4. Lấy tất cả problem trong contest
        List<String> problemIds = contestProblemRepo.findProblemIdsByContestId(contestId);

        // 5. Gán problem:view cho từng problem
        for (String problemId : problemIds) {
            rbacService.assignRole(
                    reviewerId,
                    "AUTHOR",
                    "Problem",
                    problemId
            );
        }
    }

    @Override
    public void promoteDraftToOfficial(Long contestId, ContestMakeOfficialRequestDto input) {
        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));

        if (contest.getContestType() != ContestType.DRAFT) {
            throw new ContestBusinessException(ErrorCode.CONTEST_ERROR);
        }

        // 2. Validate start time
        if (input.getStartTime() != null) {
            if (input.getStartTime().isBefore(LocalDateTime.now())) {
                throw new ContestBusinessException(ErrorCode.CONTEST_ERROR); // start date ở quá khứ
            }
            contest.setStartTime(input.getStartTime());
        } else {
            if (contest.getStartTime() == null) {
                throw new ContestBusinessException(ErrorCode.CONTEST_ERROR); // đéo có start date
            }
        }

        // set rate (welp phải là bool)
        contest.setRated(input.getRated() != null ? input.getRated() : 0L);

        contest.setVisibility(ContestVisibility.PUBLIC);

        contestRepo.save(contest);
    }

    private void contestCreateUpdateValidate(ContestCreateUpdateRequestDto input, String type) {
        if (input.getStartTime() != null) {
            if (input.getStartTime().isBefore(LocalDateTime.now())) {
                throw new ContestBusinessException(ErrorCode.CONTEST_INVALID_START_TIME);
            }
        } else {
            if (Objects.equals(type, "create")) throw new ContestBusinessException(ErrorCode.CONTEST_INVALID_START_TIME, "Start time cannot be null");
        }

        boolean ok = true;
        if (Objects.equals(type, "create")) {
            if (input.getDuration() == null) ok = false;
            if (!StringUtils.isNotNullOrBlank(input.getTitle())) ok = false;
            if (!StringUtils.isNotNullOrBlank(input.getDescription())) ok = false;
            if (input.getRated() == null) ok = false;
        }
        if (!ok) {
            throw new ContestBusinessException(ErrorCode.CONTEST_VALIDATION_ERROR);
        }
    }

    private void validateUpdatePermission(ContestEntity contestEntity) {
        Long userId = getUserIdFromToken(); // TODO: lay ra userId tu UserDetail cua Security // done
        System.out.println("userId=" + userId);
        if(userId==0) throw new ContestBusinessException(ErrorCode.CONTEST_VALIDATION_ERROR, "Khong biet author la ai");
        if (!contestEntity.getAuthor().equals(userId)) {
            throw new ContestBusinessException(ErrorCode.CONTEST_ACCESS_DENY);
        }
    }
}
