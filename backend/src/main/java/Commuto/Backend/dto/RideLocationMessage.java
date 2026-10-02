package Commuto.Backend.dto;

import java.time.Instant;

public record RideLocationMessage(
        Long rideId,
        Long driverId,
        double latitude,
        double longitude,
        double heading,
        double speed,
        Instant timestamp
) {
}