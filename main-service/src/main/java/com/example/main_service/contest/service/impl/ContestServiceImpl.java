package com.example.main_service.contest.service.impl;

import com.example.main_service.contest.dto.PageRequestDto;
import com.example.main_service.contest.dto.PageResult;
import com.example.main_service.contest.dto.contest.*;
import com.example.main_service.contest.enums.ContestStatus;
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


@Service
@Transactional
@RequiredArgsConstructor
public class ContestServiceImpl implements ContestService {

    private final ContestRepo contestRepo;

    @Override
    public ContestCreateUpdateResponseDto createContest(ContestCreateUpdateRequestDto input) {
        contestCreateUpdateValidate(input, "create");

        ContestEntity entity = ContestEntity.builder()
                .title(input.getTitle())
                .description(input.getDescription())
                .startTime(input.getStartTime())
                .duration(input.getDuration())
                .contestStatus(ContestStatus.UPCOMING)
                .contestType(input.getContestType())
                .author(Long.getLong("1")) // TODO: lay ra author tu UserDetail cua Security
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
    public ContestCreateUpdateResponseDto updateContest(Long contestId, ContestCreateUpdateRequestDto input) {
        contestCreateUpdateValidate(input, "update");
        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));

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
        var filter = input.getFilter();
        if (filter.getRated() == null) filter.setRated(Long.getLong("0"));

        Specification spec = Specification.where(ContestSpec.hasRated(filter.getRated()));

        if (filter.getContestStatus() != null) {
            spec.and(ContestSpec.hasContestStatus(filter.getContestStatus()));
        }
        if (filter.getContestType() != null) {
            spec.and(ContestSpec.hasContestType(filter.getContestType()));
        }
        if (filter.getVisibility() != null) {
            spec.and(ContestSpec.hasVisibility(filter.getVisibility()));
        }
        if (filter.getGroupId() != null) {
            spec.and(ContestSpec.hasGroupId(filter.getGroupId()));
        }
        if (filter.getAuthorId() != null) {
            spec.and(ContestSpec.hasAuthorId(filter.getAuthorId()));
        }

        var pageResult = contestRepo.findAll(spec, input.getPageRequest());
        PageResult<ContestEntity> result = new PageResult<>();
        result.setData(pageResult.getContent());
        result.setTotalCount(pageResult.getTotalElements());
        return result;
    }

    @Override
    public ContestDetailDto getById(Long contestId) {
        ContestEntity contest = contestRepo.findById(contestId)
                .orElseThrow(() -> new ContestBusinessException(ErrorCode.CONTEST_NOT_FOUND));

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
    public void deleteContest(Long contestId) {
        contestRepo.deleteById(contestId);
    }

    void contestCreateUpdateValidate(ContestCreateUpdateRequestDto input, String type) {
        if (!input.getStartTime().isEqual(null)) {
            if (input.getStartTime().isBefore(LocalDateTime.now())) {
                throw new ContestBusinessException(ErrorCode.CONTEST_INVALID_START_TIME);
            }
        } else {
            if (type == "create") throw new ContestBusinessException(ErrorCode.CONTEST_INVALID_START_TIME, "Start time cannot be null");
        }
    }
}
