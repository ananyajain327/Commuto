package Commuto.Backend.dto;

import Commuto.Backend.entity.CustomRideRequest;
import Commuto.Backend.entity.RideRequest;

import java.time.LocalDate;
import java.time.LocalTime;

public record DriverRequestSummaryDto(
        Long requestId,
        Long rideId,
        String passengerName,
        String passengerPhone,
        double passengerRating,
        String route,
        LocalDate rideDate,
        LocalTime departureTime,
        double fare,
        String status
) {
    public DriverRequestSummaryDto(RideRequest request, double passengerRating) {
        this(
                request.getId(),
                request.getRide().getId(),
                request.getPassenger().getFullName(),
                request.getPassenger().getPhone(),
                passengerRating,
                request.getRide().getStartLocation() + " → " + request.getRide().getDestination(),
                request.getRide().getRideDate(),
                request.getRide().getDepartureTime(),
                request.getRide().getExpectedFare(),
                request.getStatus().name()
        );
    }

    public DriverRequestSummaryDto(CustomRideRequest customReq, double passengerRating) {
        this(
                customReq.getId(),
                null,
                customReq.getPassenger().getFullName(),
                customReq.getPassenger().getPhone(),
                passengerRating,
                customReq.getStartLocation() + " → " + customReq.getDestination(),
                customReq.getRideDate(),
                customReq.getDepartureTime(),
                customReq.getBudgetPerSeat() * customReq.getSeatsNeeded(),
                customReq.getStatus().name()
        );
    }
}
