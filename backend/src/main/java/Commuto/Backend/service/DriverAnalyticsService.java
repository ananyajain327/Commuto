package Commuto.Backend.service;

import Commuto.Backend.dto.DriverAnalyticsResponse;
import Commuto.Backend.dto.DriverRequestSummaryDto;
import Commuto.Backend.dto.DriverRideSummaryDto;
import Commuto.Backend.entity.CustomRideRequest;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.CustomRideRequestRepository;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.RideRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class DriverAnalyticsService {

    private final RideRepository rideRepository;
    private final RideRequestRepository rideRequestRepository;
    private final CustomRideRequestRepository customRideRequestRepository;
    private final RatingService ratingService;

    public DriverAnalyticsService(
            RideRepository rideRepository,
            RideRequestRepository rideRequestRepository,
            CustomRideRequestRepository customRideRequestRepository,
            RatingService ratingService) {
        this.rideRepository = rideRepository;
        this.rideRequestRepository = rideRequestRepository;
        this.customRideRequestRepository = customRideRequestRepository;
        this.ratingService = ratingService;
    }

    @Transactional(readOnly = true)
    public DriverAnalyticsResponse getDriverAnalytics(User driver) {
        if (driver.getRole() != User.Role.DRIVER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only drivers can access driver analytics");
        }

        LocalDate today = LocalDate.now();
        List<Ride> driverRides = rideRepository.findByDriverOrderByCreatedAtDesc(driver);

        long totalRides = driverRides.size();
        long activeRides = driverRides.stream().filter(r -> r.getStatus() == Ride.RideStatus.ACTIVE).count();
        long upcomingRides = driverRides.stream().filter(r -> r.getStatus() == Ride.RideStatus.UPCOMING).count();
        long totalCompletedRides = driverRides.stream().filter(r -> r.getStatus() == Ride.RideStatus.COMPLETED).count();

        long todayRides = driverRides.stream()
                .filter(r -> today.equals(r.getRideDate()))
                .count();

        long todayCompletedRides = driverRides.stream()
                .filter(r -> today.equals(r.getRideDate()) && r.getStatus() == Ride.RideStatus.COMPLETED)
                .count();

        double todayEarnings = driverRides.stream()
                .filter(r -> today.equals(r.getRideDate()) && (r.getStatus() == Ride.RideStatus.COMPLETED || r.getStatus() == Ride.RideStatus.ACTIVE))
                .mapToDouble(Ride::getExpectedFare)
                .sum();

        LocalDate sevenDaysAgo = today.minusDays(7);
        double weekEarnings = driverRides.stream()
                .filter(r -> r.getStatus() == Ride.RideStatus.COMPLETED && r.getRideDate() != null && !r.getRideDate().isBefore(sevenDaysAgo))
                .mapToDouble(Ride::getExpectedFare)
                .sum();
        if (weekEarnings == 0 && todayEarnings > 0) {
            weekEarnings = todayEarnings;
        }

        LocalDate thirtyDaysAgo = today.minusDays(30);
        double monthEarnings = driverRides.stream()
                .filter(r -> r.getStatus() == Ride.RideStatus.COMPLETED && r.getRideDate() != null && !r.getRideDate().isBefore(thirtyDaysAgo))
                .mapToDouble(Ride::getExpectedFare)
                .sum();
        if (monthEarnings == 0 && weekEarnings > 0) {
            monthEarnings = weekEarnings;
        }

        double totalCompletedFare = driverRides.stream()
                .filter(r -> r.getStatus() == Ride.RideStatus.COMPLETED)
                .mapToDouble(Ride::getExpectedFare)
                .sum();

        double averagePerRide = totalCompletedRides > 0 ? Math.round((totalCompletedFare / totalCompletedRides) * 10.0) / 10.0 : 0.0;
        double totalDistanceKm = totalCompletedRides * 42.0;

        Double averageRating = ratingService.getAverageRating(driver);
        double totalRating = averageRating != null ? averageRating : 5.0;
        long totalRatingCount = ratingService.getRatingCount(driver);

        Ride nextRide = driverRides.stream()
                .filter(r -> r.getStatus() == Ride.RideStatus.UPCOMING || r.getStatus() == Ride.RideStatus.ACTIVE)
                .min(Comparator.comparing(Ride::getRideDate, Comparator.nullsLast(Comparator.naturalOrder()))
                        .thenComparing(Ride::getDepartureTime, Comparator.nullsLast(Comparator.naturalOrder())))
                .orElse(null);

        DriverRideSummaryDto nextUpcomingRide = nextRide != null ? new DriverRideSummaryDto(nextRide) : null;

        List<RideRequest> pendingRequestsEntities = rideRequestRepository.findByRide_DriverAndStatusOrderByCreatedAtDesc(
                driver,
                RideRequest.RequestStatus.PENDING
        );

        List<DriverRequestSummaryDto> pendingRequests = new ArrayList<>(pendingRequestsEntities.stream()
                .limit(5)
                .map(req -> {
                    Double pRating = ratingService.getAverageRating(req.getPassenger());
                    return new DriverRequestSummaryDto(req, pRating != null ? pRating : 5.0);
                })
                .toList());

        // If direct requests are fewer than 5, include open broadcasts so drivers can immediately see passengers needing rides
        if (pendingRequests.size() < 5) {
            List<CustomRideRequest> openCustomRequests = customRideRequestRepository.findByStatusOrderByCreatedAtDesc(
                    CustomRideRequest.RequestStatus.OPEN
            );
            for (CustomRideRequest customReq : openCustomRequests) {
                if (pendingRequests.size() >= 5) break;
                Double pRating = ratingService.getAverageRating(customReq.getPassenger());
                pendingRequests.add(new DriverRequestSummaryDto(customReq, pRating != null ? pRating : 5.0));
            }
        }

        return new DriverAnalyticsResponse(
                driver.getFullName(),
                driver.isVerified(),
                todayEarnings,
                todayRides,
                todayCompletedRides,
                totalRating,
                totalRatingCount,
                totalDistanceKm,
                weekEarnings,
                monthEarnings,
                averagePerRide,
                activeRides,
                upcomingRides,
                totalCompletedRides,
                totalRides,
                pendingRequests,
                nextUpcomingRide
        );
    }
}
