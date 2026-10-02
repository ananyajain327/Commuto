package Commuto.Backend.service;

import Commuto.Backend.entity.Rating;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RatingRepository;
import Commuto.Backend.repository.RideRequestRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RideRequestRepository rideRequestRepository;

    @Mock
    private RatingRepository ratingRepository;

    @InjectMocks
    private RatingService ratingService;

    @Test
    void passengerCanRateDriverAfterCompletedRide() {
        User passenger = user(1L, User.Role.PASSENGER, "Passenger");
        User driver = user(2L, User.Role.DRIVER, "Driver");
        RideRequest request = request(passenger, driver, Ride.RideStatus.COMPLETED);
        when(rideRequestRepository.findById(9L)).thenReturn(Optional.of(request));
        when(ratingRepository.existsByRequestAndRaterAndRatee(request, passenger, driver)).thenReturn(false);
        when(ratingRepository.save(any(Rating.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = ratingService.submitRating(passenger, 9L, 5, "Great trip");

        assertEquals(5, response.score());
        assertEquals("Passenger", response.raterName());
        assertEquals("Driver", response.rateeName());
        assertEquals(1L, response.rideId());
        assertEquals(9L, response.requestId());
        verify(ratingRepository).save(any(Rating.class));
    }

    @Test
    void cannotRateBeforeRideCompletes() {
        User passenger = user(1L, User.Role.PASSENGER, "Passenger");
        User driver = user(2L, User.Role.DRIVER, "Driver");
        when(rideRequestRepository.findById(9L)).thenReturn(
                Optional.of(request(passenger, driver, Ride.RideStatus.ACTIVE))
        );

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> ratingService.submitRating(passenger, 9L, 5, "Too early")
        );

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
    }

    @Test
    void nonParticipantCannotRateRide() {
        User passenger = user(1L, User.Role.PASSENGER, "Passenger");
        User driver = user(2L, User.Role.DRIVER, "Driver");
        User stranger = user(3L, User.Role.PASSENGER, "Stranger");
        when(rideRequestRepository.findById(9L)).thenReturn(
                Optional.of(request(passenger, driver, Ride.RideStatus.COMPLETED))
        );

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> ratingService.submitRating(stranger, 9L, 5, "Not eligible")
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    private RideRequest request(User passenger, User driver, Ride.RideStatus rideStatus) {
        Ride ride = new Ride();
        ReflectionTestUtils.setField(ride, "id", 1L);
        ride.setDriver(driver);
        ride.setStatus(rideStatus);
        RideRequest request = new RideRequest();
        ReflectionTestUtils.setField(request, "id", 9L);
        request.setRide(ride);
        request.setPassenger(passenger);
        request.setStatus(RideRequest.RequestStatus.ACCEPTED);
        return request;
    }

    private User user(Long id, User.Role role, String fullName) {
        User user = new User();
        user.setId(id);
        user.setRole(role);
        user.setFullName(fullName);
        return user;
    }
}