package Commuto.Backend.dto;

public record CustomRideNotificationDto(
        String type,
        Long requestId,
        String passengerName,
        String passengerPhone,
        String driverName,
        String driverPhone,
        String route,
        String rideDate,
        String departureTime,
        int seats,
        double fare,
        boolean womenOnly,
        String note,
        String status
) {}
