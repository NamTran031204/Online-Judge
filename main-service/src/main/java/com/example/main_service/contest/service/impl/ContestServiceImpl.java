package com.example.main_service.contest.service.impl;

import com.example.main_service.sharedAttribute.commonDto.PageRequestDto;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.contest.dto.contest.*;
import com.example.main_service.sharedAttribute.enums.ContestStatus;
import com.example.main_service.sharedAttribute.enums.ContestType;
import com.example.main_service.sharedAttribute.enums.ContestVisibility;
import com.example.main_service.contest.exceptions.ErrorCode;
import com.example.main_service.contest.exceptions.specException.ContestBusinessException;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
public class ContestServiceImpl implements ContestService {

    private final ContestRepo contestRepo;

    /**
     * TODO: chinh sua lai logic tao contest visibility/type vi: hien tai van dang cho tao contest OFFICIAL de test
     *
     * @param input
     * @return
     */
    @Override
    @Transactional(rollbackOn = Exception.class)
    public ContestCreateUpdateResponseDto createContest(ContestCreateUpdateRequestDto input) {
        contestCreateUpdateValidate(input, "create");

        if (input.getContestType() == null) {
            input.setContestType(ContestType.DRAFT);
        }
        if (input.getVisibility() == null) {
            input.setVisibility(ContestVisibility.PRIVATE);
        }

        if (input.getContestType() == null) {
            if (input.getContestType() == ContestType.OFFICIAL && input.getVisibility() == ContestVisibility.PRIVATE) {
                throw new ContestBusinessException(ErrorCode.CONTEST_PROBLEM_ERROR, "Khong duoc tao contest OFFICIAL nhung PRIVATE do chinh sach he thong");
            }
        } else {
            if (input.getContestType().equals(ContestType.GYM)) {
                input.setRated(0L);
            }
        }


        ContestEntity entity = ContestEntity.builder()
                .title(input.getTitle())
                .description(input.getDescription())
                .startTime(input.getStartTime())
                .duration(input.getDuration())
                .contestStatus(ContestStatus.UPCOMING)
                .contestType(input.getContestType())
                .author(1L) // TODO: lay ra author tu UserDetail cua Security
                .rated(input.getRated())
                .visibility(input.getVisibility())
                .groupId(input.getGroupId())
                .build();

        ContestEntity savedEntity = contestRepo.save(entity);

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
        if (input.getContestType() != null)
            contest.setContestType(input.getContestType());
        if (input.getGroupId() != null)
            contest.setGroupId(input.getGroupId());
        if (input.getRated() != null)
            contest.setRated(input.getRated());
        if (input.getVisibility() != null)
            contest.setVisibility(input.getVisibility());

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

    /**
     * TODO: neu da phat trien GROUP, request nay can validate get contest by visibility
     * TODO: lay ra userId tu UserDetail
     */
    @Override
    public ContestDetailDto getById(Long contestId) {
        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));

        if (contest.getVisibility().equals(ContestVisibility.PRIVATE)) {
            Long userId = 1L;
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

        List<Long> problemList = new ArrayList<>();
        /**
         * TODO: goi den judge-service de lay ra danh sach problem theo contest
         */

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
        contestRepo.deleteById(contestId);
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
        Long userId = 1L; // TODO: lay ra userId tu UserDetail cua Security

        if (!contestEntity.getAuthor().equals(userId)) {
            throw new ContestBusinessException(ErrorCode.CONTEST_ACCESS_DENY);
        }
    }
}
