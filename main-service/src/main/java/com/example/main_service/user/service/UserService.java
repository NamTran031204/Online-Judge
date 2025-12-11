package com.example.main_service.user.service;

import com.example.main_service.sharedAttribute.exceptions.specException.UserBusinessException;
import com.example.main_service.user.dto.UserDetailDto;
import com.example.main_service.user.model.UserEntity;
import com.example.main_service.user.repo.UserRepo;
import com.example.main_service.sharedAttribute.exceptions.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;

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
}
