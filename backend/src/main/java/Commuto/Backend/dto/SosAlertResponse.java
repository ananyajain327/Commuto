package Commuto.Backend.dto;

import Commuto.Backend.entity.SosAlert;

import java.time.LocalDateTime;

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
        LocalDateTime resolvedAt
) {
    public SosAlertResponse(SosAlert alert) {
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
                alert.getResolvedAt()
        );
    }
}
