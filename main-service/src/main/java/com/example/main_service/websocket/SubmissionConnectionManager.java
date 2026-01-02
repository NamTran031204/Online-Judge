package com.example.main_service.websocket;


import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

@Component
@RequiredArgsConstructor
public class SubmissionConnectionManager {

    private final ConcurrentHashMap<String, Set<WebSocketSession>> map =
            new ConcurrentHashMap<>();

    public void subscribe(String submissionId, WebSocketSession session) {
        System.out.println("[Subscribe] Added session: " + session.getId() + " for submissionId: " + submissionId);
        map.computeIfAbsent(submissionId, k -> ConcurrentHashMap.newKeySet())
                .add(session);
    }

    public void broadcast(String submissionId, String message) {
        var sessions = map.get(submissionId);
        System.out.println("[Broadcast] Lookup session for " + submissionId + ": " + sessions);

        if (sessions == null) return;

        for (var s : sessions) {
            if (!s.isOpen()) continue;
            try {
                s.sendMessage(new TextMessage(message));
            } catch (Exception ignored) {}
        }
    }

    public void remove(WebSocketSession session) {
        map.values().forEach(set -> set.remove(session));
    }
}

