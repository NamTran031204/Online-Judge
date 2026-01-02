package com.example.jude_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic submissionProgressTopic() {
        return new NewTopic("submission.progress", 1, (short) 1);
    }
}

