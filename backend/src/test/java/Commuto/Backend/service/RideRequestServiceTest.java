package Commuto.Backend.service;

import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.RideRequestRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RideRequestServiceTest {

    @Mock
    private RideRequestRepository rideRequestRepository;

    @Mock
    private RideRepository rideRepository;

    @Mock
    private org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @Mock
    private RatingService ratingService;

    @InjectMocks
    private RideRequestService rideRequestService;

    @Test
    void cancellingAcceptedRequestRestoresSeatsForUpcomingRide() {
        User passenger = passenger(12L);
        Ride ride = new Ride();
        ride.setStatus(Ride.RideStatus.UPCOMING);
        ride.setAvailableSeats(1);

        RideRequest request = request(passenger, ride, RideRequest.RequestStatus.ACCEPTED);
        request.setSeatsRequested(2);
        when(rideRequestRepository.findById(7L)).thenReturn(Optional.of(request));
        when(rideRequestRepository.save(request)).thenReturn(request);

        RideRequest cancelled = rideRequestService.cancelRequest(7L, passenger);

        assertEquals(RideRequest.RequestStatus.CANCELLED, cancelled.getStatus());
        assertEquals(3, ride.getAvailableSeats());
        verify(rideRepository).save(ride);
    }

    @Test
    void cancellingPendingRequestDoesNotChangeAvailableSeats() {
        User passenger = passenger(12L);
        Ride ride = new Ride();
        ride.setAvailableSeats(3);

        RideRequest request = request(passenger, ride, RideRequest.RequestStatus.PENDING);
        when(rideRequestRepository.findById(7L)).thenReturn(Optional.of(request));
        when(rideRequestRepository.save(request)).thenReturn(request);

        RideRequest cancelled = rideRequestService.cancelRequest(7L, passenger);

        assertEquals(RideRequest.RequestStatus.CANCELLED, cancelled.getStatus());
        assertEquals(3, ride.getAvailableSeats());
        verify(rideRepository, never()).save(ride);
    }

    @Test
    void passengerCannotCancelAnotherPassengersRequest() {
        User owner = passenger(12L);
        User otherPassenger = passenger(13L);
        RideRequest request = request(owner, new Ride(), RideRequest.RequestStatus.PENDING);
        when(rideRequestRepository.findById(7L)).thenReturn(Optional.of(request));

        assertThrows(RuntimeException.class, () -> rideRequestService.cancelRequest(7L, otherPassenger));

        verify(rideRequestRepository, never()).save(request);
        verify(rideRepository, never()).save(org.mockito.ArgumentMatchers.any(Ride.class));
    }

    private User passenger(Long id) {
        User passenger = new User();
        passenger.setId(id);
        return passenger;
    }

    private RideRequest request(User passenger, Ride ride, RideRequest.RequestStatus status) {
        RideRequest request = new RideRequest();
        request.setPassenger(passenger);
        request.setRide(ride);
        request.setStatus(status);
        request.setSeatsRequested(1);
        return request;
    }
}