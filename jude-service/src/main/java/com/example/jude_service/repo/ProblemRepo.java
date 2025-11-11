package com.example.jude_service.repo;

import com.example.jude_service.entities.problem.ProblemEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemRepo extends MongoRepository<ProblemEntity, String> {
    List<ProblemEntity> findByContestId(String contestId);
}
