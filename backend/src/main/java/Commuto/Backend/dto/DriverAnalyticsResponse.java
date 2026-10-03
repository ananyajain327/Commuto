package Commuto.Backend.dto;

import java.util.List;
import Commuto.Backend.dto.DriverRideSummaryDto;
import Commuto.Backend.dto.DriverRequestSummaryDto;

public record DriverAnalyticsResponse(
        String driverName,
        boolean isVerified,
        double todayEarnings,
        long todayRides,
        long todayCompletedRides,
        double totalRating,
        long totalRatingCount,
        double totalDistanceKm,
        double weekEarnings,
        double monthEarnings,
        double averagePerRide,
        long activeRides,
        long upcomingRides,
        long totalCompletedRides,
        long totalRides,
        List<DriverRequestSummaryDto> pendingRequests,
        DriverRideSummaryDto nextUpcomingRide
) {}
