package com.example.main_service.contest.repo;

import com.example.main_service.contest.model.ContestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ContestRepo extends JpaRepository<ContestEntity, Long>, JpaSpecificationExecutor<ContestEntity> {

}
