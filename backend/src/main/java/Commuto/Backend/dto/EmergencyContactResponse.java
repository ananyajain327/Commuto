package Commuto.Backend.dto;

import Commuto.Backend.entity.EmergencyContact;

import java.time.LocalDateTime;

public record EmergencyContactResponse(
        Long id,
        String name,
        String phone,
        String relationship,
        boolean isPrimary,
        LocalDateTime createdAt
) {
    public EmergencyContactResponse(EmergencyContact contact) {
        this(
                contact.getId(),
                contact.getName(),
                contact.getPhone(),
                contact.getRelationship(),
                contact.isPrimary(),
                contact.getCreatedAt()
        );
    }
}
