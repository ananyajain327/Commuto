package Commuto.Backend.dto;

import Commuto.Backend.entity.RideChatMessage;
import java.time.Instant;

public class RideChatMessageDto {

    private Long id;
    private Long rideId;
    private Long senderId;
    private String senderName;
    private String senderRole;
    private String content;
    private Instant sentAt;

    public RideChatMessageDto() {
    }

    public RideChatMessageDto(Long id, Long rideId, Long senderId, String senderName, String senderRole, String content, Instant sentAt) {
        this.id = id;
        this.rideId = rideId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderRole = senderRole;
        this.content = content;
        this.sentAt = sentAt;
    }

    public RideChatMessageDto(RideChatMessage msg) {
        this.id = msg.getId();
        this.rideId = msg.getRide().getId();
        this.senderId = msg.getSender().getId();
        this.senderName = msg.getSender().getFullName();
        this.senderRole = msg.getSender().getRole().name();
        this.content = msg.getContent();
        this.sentAt = msg.getSentAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRideId() {
        return rideId;
    }

    public void setRideId(Long rideId) {
        this.rideId = rideId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderRole() {
        return senderRole;
    }

    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getSentAt() {
        return sentAt;
    }

    public void setSentAt(Instant sentAt) {
        this.sentAt = sentAt;
    }
}
