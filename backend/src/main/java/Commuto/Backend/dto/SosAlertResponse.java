package Commuto.Backend.dto;

import Commuto.Backend.entity.SosAlert;

import java.time.LocalDateTime;
import java.util.List;

public record SosAlertResponse(
        Long id,
        Long userId,
        String userName,
        String userPhone,
        Long rideId,
        Double latitude,
        Double longitude,
        String status,
        String message,
        LocalDateTime createdAt,
        LocalDateTime resolvedAt,
        List<String> notifiedContacts
) {
    public SosAlertResponse(SosAlert alert) {
        this(alert, List.of());
    }

    public SosAlertResponse(SosAlert alert, List<String> notifiedContacts) {
        this(
                alert.getId(),
                alert.getUser().getId(),
                alert.getUser().getFullName(),
                alert.getUser().getPhone(),
                alert.getRide() != null ? alert.getRide().getId() : null,
                alert.getLatitude(),
                alert.getLongitude(),
                alert.getStatus().name(),
                alert.getMessage(),
                alert.getCreatedAt(),
                alert.getResolvedAt(),
                notifiedContacts != null ? notifiedContacts : List.of()
        );
    }
}
