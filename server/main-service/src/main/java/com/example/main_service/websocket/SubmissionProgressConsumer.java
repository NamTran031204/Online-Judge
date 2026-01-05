package com.example.main_service.websocket;


import com.example.main_service.websocket.SubmissionConnectionManager;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Component
public class SubmissionProgressConsumer {

    private final SubmissionConnectionManager wsManager;
    private final ObjectMapper mapper = new ObjectMapper();

    public SubmissionProgressConsumer(SubmissionConnectionManager wsManager) {
        this.wsManager = wsManager;
    }

    @KafkaListener(
            topics = "submission.progress",
            groupId = "submission-progress-consumer"
    )
    public void onProgress(String message) throws Exception {
        JsonNode json = mapper.readTree(message);
        String submissionId = json.get("submissionId").asText();
        System.out.println("[Kafka] Received message on 'submission.progress': " + message);

        wsManager.broadcast(submissionId, message);
    }
}

