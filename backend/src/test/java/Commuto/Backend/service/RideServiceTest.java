package Commuto.Backend.service;

import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RideServiceTest {

    @Mock
    private RideRepository rideRepository;

    @InjectMocks
    private RideService rideService;

    @Test
    void startingRideTransitionsUpcomingRideToActive() {
        User driver = driver(7L);
        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setStatus(Ride.RideStatus.UPCOMING);
        ride.setRideDate(LocalDate.now());
        ride.setDepartureTime(LocalTime.now().minusMinutes(5));
        when(rideRepository.findById(11L)).thenReturn(Optional.of(ride));
        when(rideRepository.save(ride)).thenReturn(ride);

        Ride started = rideService.startRide(11L, driver);

        assertEquals(Ride.RideStatus.ACTIVE, started.getStatus());
        verify(rideRepository).save(ride);
    }

    @Test
    void driverCannotStartRideBeforeScheduledDateTime() {
        User driver = driver(7L);
        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setStatus(Ride.RideStatus.UPCOMING);
        ride.setRideDate(LocalDate.now().plusDays(1));
        ride.setDepartureTime(LocalTime.of(10, 0));
        when(rideRepository.findById(11L)).thenReturn(Optional.of(ride));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> rideService.startRide(11L, driver));
        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    void completingActiveRideTransitionsToCompleted() {
        User driver = driver(7L);
        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setStatus(Ride.RideStatus.ACTIVE);
        when(rideRepository.findById(11L)).thenReturn(Optional.of(ride));
        when(rideRepository.save(ride)).thenReturn(ride);

        Ride completed = rideService.completeRide(11L, driver);

        assertEquals(Ride.RideStatus.COMPLETED, completed.getStatus());
        verify(rideRepository).save(ride);
    }

    @Test
    void driverCannotStartOrCompleteAnotherDriversRide() {
        User owner = driver(7L);
        User otherDriver = driver(9L);
        Ride ride = new Ride();
        ride.setDriver(owner);
        ride.setStatus(Ride.RideStatus.UPCOMING);
        when(rideRepository.findById(11L)).thenReturn(Optional.of(ride));

        assertThrows(RuntimeException.class, () -> rideService.startRide(11L, otherDriver));
    }

    @Test
    void unverifiedDriverCannotCreateRide() {
        User driver = driver(7L);
        driver.setVerified(false);

        Commuto.Backend.dto.CreateRideRequest request = new Commuto.Backend.dto.CreateRideRequest();
        request.setStartLocation("Jaipur");
        request.setDestination("Delhi");
        request.setExpectedFare(500.0);

        org.springframework.web.server.ResponseStatusException ex = assertThrows(
                org.springframework.web.server.ResponseStatusException.class,
                () -> rideService.createRide(driver, request)
        );
        assertEquals(org.springframework.http.HttpStatus.FORBIDDEN, ex.getStatusCode());
    }

    @Test
    void verifiedDriverCanCreateRide() {
        User driver = driver(7L);
        driver.setVerified(true);

        Commuto.Backend.dto.CreateRideRequest request = new Commuto.Backend.dto.CreateRideRequest();
        request.setStartLocation("Jaipur");
        request.setDestination("Delhi");
        request.setExpectedFare(500.0);
        request.setAvailableSeats(3);

        when(rideRepository.save(any(Ride.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Ride created = rideService.createRide(driver, request);
        assertEquals(Ride.RideStatus.UPCOMING, created.getStatus());
        assertEquals("Jaipur", created.getStartLocation());
        assertEquals("Delhi", created.getDestination());
        verify(rideRepository).save(any(Ride.class));
    }

    private User driver(Long id) {
        User user = new User();
        user.setId(id);
        user.setRole(User.Role.DRIVER);
        user.setActive(true);
        return user;
    }
}
