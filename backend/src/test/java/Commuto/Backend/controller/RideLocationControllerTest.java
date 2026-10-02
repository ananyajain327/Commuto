package Commuto.Backend.controller;

import Commuto.Backend.dto.RideLocationMessage;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RideLocationControllerTest {

    @Mock
    private RideRepository rideRepository;

    @InjectMocks
    private RideLocationController rideLocationController;

    @Test
    void publishesLocationForTheRideDriverWhenRideIsActive() {
        User driver = user(10L, User.Role.DRIVER);
        Ride ride = ride(driver, Ride.RideStatus.ACTIVE);
        when(rideRepository.findById(5L)).thenReturn(Optional.of(ride));

        RideLocationMessage update = rideLocationController.updateLocation(
                5L,
                new RideLocationMessage(5L, 999L, 26.9124, 75.7873, 90, 12, Instant.EPOCH),
                principal(driver)
        );

        assertEquals(5L, update.rideId());
        assertEquals(10L, update.driverId());
        assertEquals(26.9124, update.latitude());
        assertNotNull(update.timestamp());
        assertEquals(false, Instant.EPOCH.equals(update.timestamp()));
    }

    @Test
    void rejectsLocationFromAnotherDriver() {
        User rideDriver = user(10L, User.Role.DRIVER);
        User otherDriver = user(11L, User.Role.DRIVER);
        when(rideRepository.findById(5L)).thenReturn(Optional.of(ride(rideDriver, Ride.RideStatus.ACTIVE)));

        assertThrows(AccessDeniedException.class, () -> rideLocationController.updateLocation(
                5L,
                new RideLocationMessage(5L, 11L, 26, 75, 0, 0, Instant.now()),
                principal(otherDriver)
        ));
    }

    @Test
    void rejectsLocationForRideThatHasNotStarted() {
        User driver = user(10L, User.Role.DRIVER);
        when(rideRepository.findById(5L)).thenReturn(Optional.of(ride(driver, Ride.RideStatus.UPCOMING)));

        assertThrows(IllegalStateException.class, () -> rideLocationController.updateLocation(
                5L,
                new RideLocationMessage(5L, 10L, 26, 75, 0, 0, Instant.now()),
                principal(driver)
        ));
    }

    @Test
    void rejectsCoordinatesOutsideValidRange() {
        User driver = user(10L, User.Role.DRIVER);
        when(rideRepository.findById(5L)).thenReturn(Optional.of(ride(driver, Ride.RideStatus.ACTIVE)));

        assertThrows(IllegalArgumentException.class, () -> rideLocationController.updateLocation(
                5L,
                new RideLocationMessage(5L, 10L, 91, 75, 0, 0, Instant.now()),
                principal(driver)
        ));
    }

    private User user(Long id, User.Role role) {
        User user = new User();
        user.setId(id);
        user.setRole(role);
        return user;
    }

    private Ride ride(User driver, Ride.RideStatus status) {
        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setStatus(status);
        return ride;
    }

    private UsernamePasswordAuthenticationToken principal(User user) {
        return new UsernamePasswordAuthenticationToken(
                user,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}