package com.example.jude_service.repo;

import com.example.jude_service.entities.submission.SubmissionEntity;
import com.mongodb.client.MongoDatabase;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SubmissionRepo extends MongoRepository<SubmissionEntity, String> {
}
