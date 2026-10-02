package Commuto.Backend.dto;

public record AdminOverviewResponse(
        long totalUsers,
        long totalDrivers,
        long verifiedDrivers,
        long activeRides,
        long completedRides,
        long totalRides,
        long pendingVerifications,
        long activeSosAlerts,
        double platformGrossFare
) {
}
