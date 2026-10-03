package Commuto.Backend.controller;

import Commuto.Backend.dto.RideChatMessageDto;
import Commuto.Backend.dto.SendChatMessageRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.service.RideChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
public class RideChatController {

    private final RideChatService rideChatService;
    private final SimpMessagingTemplate messagingTemplate;

    public RideChatController(
            RideChatService rideChatService,
            SimpMessagingTemplate messagingTemplate) {
        this.rideChatService = rideChatService;
        this.messagingTemplate = messagingTemplate;
    }

    // ==========================================
    // REST API - Get Ride Chat History
    // ==========================================
    @GetMapping("/api/rides/{rideId}/chat")
    public ResponseEntity<List<RideChatMessageDto>> getChatHistory(
            @PathVariable Long rideId,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        List<RideChatMessageDto> history = rideChatService.getRideChatHistory(rideId, user);
        return ResponseEntity.ok(history);
    }

    // ==========================================
    // REST API - Send Message (Fallback & HTTP)
    // ==========================================
    @PostMapping("/api/rides/{rideId}/chat")
    public ResponseEntity<RideChatMessageDto> sendMessage(
            @PathVariable Long rideId,
            @Valid @RequestBody SendChatMessageRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        RideChatMessageDto saved = rideChatService.sendMessage(rideId, user, request);

        // Broadcast to all WebSocket listeners for this ride
        messagingTemplate.convertAndSend("/topic/ride/" + rideId + "/chat", saved);

        return ResponseEntity.ok(saved);
    }

    // ==========================================
    // STOMP WebSocket - Direct In-Ride Chat
    // ==========================================
    @MessageMapping("/ride/{rideId}/chat")
    public void handleWebSocketMessage(
            @DestinationVariable Long rideId,
            @Payload SendChatMessageRequest request,
            Principal principal) {

        if (!(principal instanceof Authentication authentication)
                || !(authentication.getPrincipal() instanceof User user)) {
            throw new AccessDeniedException("Authentication required to send chat message");
        }

        RideChatMessageDto saved = rideChatService.sendMessage(rideId, user, request);
        messagingTemplate.convertAndSend("/topic/ride/" + rideId + "/chat", saved);
    }
}
