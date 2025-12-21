package com.example.main_service.user.repo;

import com.example.main_service.user.model.UserEntity;
import org.slf4j.Logger;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends CrudRepository<UserEntity, Integer> {

    Optional<UserEntity> findByUserName(String userName);

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByUserId(Long userId);

    @Query("SELECT u.userId, u.userName FROM UserEntity u WHERE u.userId IN :userIds")
    List<Object[]> findUserIdAndUserNameByUserIdIn(@Param("userIds") List<Long> userIds);

}
