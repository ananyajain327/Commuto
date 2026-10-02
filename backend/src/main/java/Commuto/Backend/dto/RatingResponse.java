package Commuto.Backend.dto;

import Commuto.Backend.entity.Rating;

import java.time.LocalDateTime;

public record RatingResponse(
        Long id,
        Long requestId,
        Long rideId,
        String raterName,
        String rateeName,
        int score,
        String comment,
        LocalDateTime createdAt
) {
    public RatingResponse(Rating rating) {
        this(
                rating.getId(),
                rating.getRequest().getId(),
                rating.getRequest().getRide().getId(),
                rating.getRater().getFullName(),
                rating.getRatee().getFullName(),
                rating.getScore(),
                rating.getComment(),
                rating.getCreatedAt()
        );
    }
}