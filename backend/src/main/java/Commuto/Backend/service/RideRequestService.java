package Commuto.Backend.service;

import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.RideRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RideRequestService {

    private final RideRequestRepository rideRequestRepository;
    private final RideRepository rideRepository;

    public RideRequestService(
            RideRequestRepository rideRequestRepository,
            RideRepository rideRepository) {

        this.rideRequestRepository = rideRequestRepository;
        this.rideRepository = rideRepository;
    }

    public RideRequest createRequest(
            User passenger,
            Long rideId,
            int seatsRequested,
            String pickupPreference,
            String note) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() ->
                        new RuntimeException("Ride not found"));

        if (ride.getStatus() != Ride.RideStatus.UPCOMING) {
            throw new RuntimeException(
                    "Ride is not available for booking");
        }

        if (seatsRequested <= 0) {
            throw new RuntimeException(
                    "At least one seat must be requested");
        }

        if (seatsRequested > ride.getAvailableSeats()) {
            throw new RuntimeException(
                    "Not enough seats available");
        }

        if (rideRequestRepository.existsByRideAndPassenger(
                ride, passenger)) {

            throw new RuntimeException(
                    "You have already requested this ride");
        }

        if (ride.getDriver().getId().equals(passenger.getId())) {
            throw new RuntimeException(
                    "Driver cannot request their own ride");
        }

        RideRequest request = new RideRequest();

        request.setRide(ride);
        request.setPassenger(passenger);
        request.setSeatsRequested(seatsRequested);
        request.setPickupPreference(pickupPreference);
        request.setNote(note);

        double farePerSeat =
                ride.getExpectedFare() / ride.getAvailableSeats();

        double totalFare =
                farePerSeat * seatsRequested;

        request.setFare(totalFare);
        request.setStatus(
                RideRequest.RequestStatus.PENDING);

        return rideRequestRepository.save(request);
    }

    public List<RideRequest> getPassengerRequests(
            User passenger) {

        return rideRequestRepository
                .findByPassenger(passenger);
    }

    public List<RideRequest> getRideRequests(Ride ride) {

        return rideRequestRepository
                .findByRide(ride);
    }
}