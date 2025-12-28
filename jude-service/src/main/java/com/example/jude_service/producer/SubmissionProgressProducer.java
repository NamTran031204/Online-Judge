package com.example.jude_service.producer;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class SubmissionProgressProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper mapper = new ObjectMapper();

    public void send(String submissionId, int current, int total) {
        try {
            kafkaTemplate.send(
                    "submission.progress",
                    submissionId,
                    mapper.writeValueAsString(
                            Map.of(
                                    "submissionId", submissionId,
                                    "currentTest", current,
                                    "totalTests", total,
                                    "status", "RUNNING"
                            )
                    )
            );
        } catch (Exception ignored) {}
    }
}

