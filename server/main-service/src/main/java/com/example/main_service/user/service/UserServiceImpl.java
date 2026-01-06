package com.example.main_service.user.service;

import com.example.main_service.dashboard.dtos.UserContestRatingHistoryItemDto;
import com.example.main_service.sharedAttribute.exceptions.specException.UserBusinessException;
import com.example.main_service.user.dto.UserDetailDto;
import com.example.main_service.user.model.UserEntity;
import com.example.main_service.user.model.UserRatingHistoryEntity;
import com.example.main_service.user.repo.UserRatingHistoryRepo;
import com.example.main_service.user.repo.UserRepo;
import com.example.main_service.sharedAttribute.exceptions.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j

public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;
    private final UserRatingHistoryRepo userRatingHistoryRepo;

    public UserDetailDto getUserDetail(String username) {
        UserEntity u = userRepo.findByUserName(username)
                .orElseThrow(() -> new UserBusinessException(ErrorCode.USER_NOT_FOUND));

        return new UserDetailDto(
                u.getUserId(),
                u.getUserName(),
                u.getEmail(),
                u.getInfo()
        );
    }

    public int findRatingByUserId(Long userId) {
        return userRatingHistoryRepo
                .findFirstByUserIdOrderByContestIdDesc(userId)
                .map(UserRatingHistoryEntity::getRating)
                .orElse(0);
    }

    public List<UserContestRatingHistoryItemDto> getUserRatingHistory(Long userId) {
        var rows = userRatingHistoryRepo.findByUserIdOrderByContestIdAsc(userId);

        List<UserContestRatingHistoryItemDto> result = new ArrayList<>(rows.size());

        Integer prevRating = null;
        for (var r : rows) {
            int newRating = r.getRating();
            int delta = (prevRating == null) ? 0 : (newRating - prevRating);

            result.add(UserContestRatingHistoryItemDto.builder()
                    .contestId(r.getContestId())
                    .newRating(newRating)
                    .delta(delta)
                    .build());

            prevRating = newRating;
        }
        return result;
    }

    @Transactional
    public void addRatingHistory(UserRatingHistoryEntity history) {

        boolean existed = userRatingHistoryRepo.existsByUserIdAndContestId(
                        history.getUserId(),
                        history.getContestId()
                );

        if (existed) {
            log.warn(
                    "[Rating] already calculated: userId={}, contestId={}",
                    history.getUserId(),
                    history.getContestId()
            );
            return;
        }
        userRatingHistoryRepo.save(history);
    }

    public Map<Long, String> getUserNames(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Map.of();
        }

        List<Object[]> results = userRepo.findUserIdAndUserNameByUserIdIn(userIds);

        return results.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (String) row[1]
                ));
    }

}
