package Commuto.Backend.dto;

import Commuto.Backend.entity.Ride;

import java.time.LocalDate;
import java.time.LocalTime;

public record DriverRideSummaryDto(
        Long id,
        String startLocation,
        String destination,
        LocalDate rideDate,
        LocalTime departureTime,
        int availableSeats,
        double expectedFare,
        String status
) {
    public DriverRideSummaryDto(Ride ride) {
        this(
                ride.getId(),
                ride.getStartLocation(),
                ride.getDestination(),
                ride.getRideDate(),
                ride.getDepartureTime(),
                ride.getAvailableSeats(),
                ride.getExpectedFare(),
                ride.getStatus().name()
        );
    }
}
