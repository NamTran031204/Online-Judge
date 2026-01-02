package com.example.jude_service.producer;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class SubmissionProgressProducer {

    private final KafkaTemplate<Object, Object> kafkaTemplate;
    private final ObjectMapper mapper = new ObjectMapper();

    // tao instance cua cai nay xong log
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
            System.out.println("submission.progress topic ==== " + submissionId + " ==== " + current + " ===== " + total);
        } catch (Exception ignored) {}
    }
}

