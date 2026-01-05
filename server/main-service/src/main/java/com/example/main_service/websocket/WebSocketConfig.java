package com.example.main_service.websocket;


import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final SubmissionWebSocketHandler handler;

    public WebSocketConfig(SubmissionWebSocketHandler handler) {
        this.handler = handler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/ws")
                .setAllowedOrigins("*");
    }
    @PostConstruct
    public void debug() {
        System.out.println("[DEBUG] WebSocketConfig registered.");
    }

}

