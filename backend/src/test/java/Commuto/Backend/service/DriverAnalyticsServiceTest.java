package Commuto.Backend.service;

import Commuto.Backend.dto.DriverAnalyticsResponse;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.RideRequestRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DriverAnalyticsServiceTest {

    @Mock
    private RideRepository rideRepository;

    @Mock
    private RideRequestRepository rideRequestRepository;

    @Mock
    private RatingService ratingService;

    @InjectMocks
    private DriverAnalyticsService driverAnalyticsService;

    @Test
    void driverAnalyticsCalculatesCorrectly() {
        User driver = new User();
        ReflectionTestUtils.setField(driver, "id", 10L);
        driver.setFullName("Ananya Jain");
        driver.setRole(User.Role.DRIVER);
        driver.setVerified(true);

        LocalDate today = LocalDate.now();

        Ride completedToday = new Ride();
        ReflectionTestUtils.setField(completedToday, "id", 101L);
        completedToday.setDriver(driver);
        completedToday.setStartLocation("Jaipur");
        completedToday.setDestination("Ajmer");
        completedToday.setRideDate(today);
        completedToday.setDepartureTime(LocalTime.of(9, 0));
        completedToday.setExpectedFare(300.0);
        completedToday.setStatus(Ride.RideStatus.COMPLETED);

        Ride upcomingToday = new Ride();
        ReflectionTestUtils.setField(upcomingToday, "id", 102L);
        upcomingToday.setDriver(driver);
        upcomingToday.setStartLocation("Ajmer");
        upcomingToday.setDestination("Jaipur");
        upcomingToday.setRideDate(today);
        upcomingToday.setDepartureTime(LocalTime.of(18, 0));
        upcomingToday.setExpectedFare(350.0);
        upcomingToday.setStatus(Ride.RideStatus.UPCOMING);

        when(rideRepository.findByDriverOrderByCreatedAtDesc(driver))
                .thenReturn(List.of(completedToday, upcomingToday));
        when(ratingService.getAverageRating(driver)).thenReturn(4.9);
        when(ratingService.getRatingCount(driver)).thenReturn(12L);
        when(rideRequestRepository.findByRide_DriverAndStatusOrderByCreatedAtDesc(driver, Commuto.Backend.entity.RideRequest.RequestStatus.PENDING))
                .thenReturn(Collections.emptyList());

        DriverAnalyticsResponse analytics = driverAnalyticsService.getDriverAnalytics(driver);

        assertEquals("Ananya Jain", analytics.driverName());
        assertTrue(analytics.isVerified());
        assertEquals(300.0, analytics.todayEarnings());
        assertEquals(2, analytics.todayRides());
        assertEquals(1, analytics.todayCompletedRides());
        assertEquals(1, analytics.totalCompletedRides());
        assertEquals(2, analytics.totalRides());
        assertEquals(4.9, analytics.totalRating());
        assertEquals(12L, analytics.totalRatingCount());
        assertEquals(1, analytics.upcomingRides());
        assertNotNull(analytics.nextUpcomingRide());
        assertEquals(102L, analytics.nextUpcomingRide().id());
    }

    @Test
    void nonDriverCannotAccessDriverAnalytics() {
        User passenger = new User();
        passenger.setRole(User.Role.PASSENGER);

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> driverAnalyticsService.getDriverAnalytics(passenger)
        );
        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
    }
}
