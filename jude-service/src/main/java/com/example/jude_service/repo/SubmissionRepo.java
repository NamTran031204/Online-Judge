package com.example.jude_service.repo;

import com.example.jude_service.entities.submission.SubmissionEntity;
import com.mongodb.client.MongoDatabase;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubmissionRepo extends MongoRepository<SubmissionEntity, String> {
    void deleteByProblemId(String problemId);
    void deleteByUserId(Long userId);
}
