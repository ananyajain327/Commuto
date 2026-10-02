package Commuto.Backend.service;

import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
        when(rideRepository.findById(11L)).thenReturn(Optional.of(ride));
        when(rideRepository.save(ride)).thenReturn(ride);

        Ride started = rideService.startRide(11L, driver);

        assertEquals(Ride.RideStatus.ACTIVE, started.getStatus());
        verify(rideRepository).save(ride);
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

    private User driver(Long id) {
        User user = new User();
        user.setId(id);
        user.setRole(User.Role.DRIVER);
        return user;
    }
}
