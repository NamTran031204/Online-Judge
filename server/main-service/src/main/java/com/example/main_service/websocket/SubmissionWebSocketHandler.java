package com.example.main_service.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Component
public class SubmissionWebSocketHandler extends TextWebSocketHandler {

    private final SubmissionConnectionManager manager;
    private final ObjectMapper mapper = new ObjectMapper();

    public SubmissionWebSocketHandler(SubmissionConnectionManager manager) {
        this.manager = manager;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message)
            throws Exception {

        JsonNode json = mapper.readTree(message.getPayload());
        String submissionId = json.get("submissionId").asText();

        manager.subscribe(submissionId, session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        manager.remove(session);
    }
}
