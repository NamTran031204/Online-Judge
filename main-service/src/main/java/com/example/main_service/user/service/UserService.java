package com.example.main_service.user.service;

import com.example.main_service.dashboard.dtos.UserContestRatingHistoryItemDto;
import com.example.main_service.user.dto.UserDetailDto;
import com.example.main_service.user.model.UserRatingHistoryEntity;

import java.util.List;
import java.util.Map;

public interface UserService {
    public UserDetailDto getUserDetail(String username);
    public int findRatingByUserId(Long userId);
    public List<UserContestRatingHistoryItemDto> getUserRatingHistory(Long userId);
    public void addRatingHistory(UserRatingHistoryEntity history);
    public Map<Long, String> getUserNames(List<Long> userIds);
}
