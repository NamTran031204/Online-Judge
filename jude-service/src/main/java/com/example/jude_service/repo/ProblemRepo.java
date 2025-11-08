package com.example.jude_service.repo;

import com.example.jude_service.entities.problem.ProblemEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProblemRepo extends MongoRepository<ProblemEntity, String> {
}
