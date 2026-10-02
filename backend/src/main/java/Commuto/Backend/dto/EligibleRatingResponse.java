package Commuto.Backend.dto;

import Commuto.Backend.entity.RideRequest;

import java.time.LocalDate;

public record EligibleRatingResponse(
        Long requestId,
        Long rideId,
        String targetName,
        String startLocation,
        String destination,
        LocalDate rideDate
) {
    public EligibleRatingResponse(RideRequest request, String targetName) {
        this(
                request.getId(),
                request.getRide().getId(),
                targetName,
                request.getRide().getStartLocation(),
                request.getRide().getDestination(),
                request.getRide().getRideDate()
        );
    }
}