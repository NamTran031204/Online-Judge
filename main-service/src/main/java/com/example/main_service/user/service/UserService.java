package com.example.main_service.user.service;

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

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j

//them user rating history
public class UserService {
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
    public String getUserName(Long userId) {
        String userName = userRepo.findByUserId(userId)
                .map(UserEntity::getUserName)
                .orElse("unknown");
        return userName;
    }

    public int findRatingByUserId(Long userId) {
        return userRatingHistoryRepo
                .findFirstByUserIdOrderByContestIdDesc(userId)
                .map(UserRatingHistoryEntity::getRating)
                .orElse(0);
    }

    @Transactional
    public void addRatingHistory(UserRatingHistoryEntity history) {

        // idempotent check (rất quan trọng)
        boolean existed = userRatingHistoryRepo
                .existsByUserIdAndContestId(
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
