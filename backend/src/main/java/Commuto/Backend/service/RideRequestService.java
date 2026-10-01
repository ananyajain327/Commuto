package Commuto.Backend.service;

import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.RideRequest.RequestStatus;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.RideRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public RideRequest createRequest(
            User passenger,
            Long rideId,
            Integer seatsRequested,
            String pickupPreference,
            String note) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getDriver().getId().equals(passenger.getId())) {
            throw new RuntimeException("Driver cannot request their own ride");
        }

        if (rideRequestRepository.existsByRideAndPassenger(ride, passenger)) {
            throw new RuntimeException("You have already requested this ride");
        }

        if (seatsRequested == null || seatsRequested <= 0) {
            throw new RuntimeException("Invalid seat count requested");
        }

        if (ride.getAvailableSeats() < seatsRequested) {
            throw new RuntimeException("Not enough seats available");
        }

        // Calculate fare per seat
        double farePerSeat = ride.getAvailableSeats() > 0
                ? (ride.getExpectedFare() / (double) ride.getAvailableSeats())
                : ride.getExpectedFare();
        double calculatedFare = farePerSeat * seatsRequested;

        RideRequest request = new RideRequest();
        request.setRide(ride);
        request.setPassenger(passenger);
        request.setSeatsRequested(seatsRequested);
        request.setPickupPreference(pickupPreference);
        request.setNote(note);
        request.setFare(calculatedFare);
        request.setStatus(RequestStatus.PENDING);

        return rideRequestRepository.save(request);
    }

    public List<RideRequest> getPassengerRequests(User passenger) {
        return rideRequestRepository.findByPassengerOrderByCreatedAtDesc(passenger);
    }

    @Transactional
    public RideRequest cancelRequest(Long requestId, User passenger) {
        RideRequest request = rideRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Ride request not found"));

        if (!request.getPassenger().getId().equals(passenger.getId())) {
            throw new RuntimeException("Unauthorized: You are not the passenger for this request");
        }

        if (request.getStatus() != RequestStatus.PENDING
                && request.getStatus() != RequestStatus.ACCEPTED) {
            throw new RuntimeException("Request cannot be cancelled in its current status");
        }

        Ride ride = request.getRide();
        if (request.getStatus() == RequestStatus.ACCEPTED) {
            if (ride.getStatus() != Ride.RideStatus.UPCOMING) {
                throw new RuntimeException("An accepted request can only be cancelled before the ride starts");
            }

            ride.setAvailableSeats(ride.getAvailableSeats() + request.getSeatsRequested());
            rideRepository.save(ride);
        }

        request.setStatus(RequestStatus.CANCELLED);
        return rideRequestRepository.save(request);
    }

    public List<RideRequest> getRideRequestsForDriver(Long rideId, User driver) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("Unauthorized: You are not the driver of this ride");
        }

        return rideRequestRepository.findByRideOrderByCreatedAtDesc(ride);
    }

    @Transactional
    public RideRequest acceptRequest(Long requestId, User driver) {
        RideRequest request = rideRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Ride request not found"));

        Ride ride = request.getRide();

        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("Unauthorized: You are not the driver of this ride");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request has already been processed: " + request.getStatus());
        }

        if (ride.getAvailableSeats() < request.getSeatsRequested()) {
            throw new RuntimeException("Cannot accept: Not enough seats remaining");
        }

        // Deduct seats
        ride.setAvailableSeats(ride.getAvailableSeats() - request.getSeatsRequested());
        rideRepository.save(ride);

        request.setStatus(RequestStatus.ACCEPTED);
        return rideRequestRepository.save(request);
    }

    @Transactional
    public RideRequest rejectRequest(Long requestId, User driver) {
        RideRequest request = rideRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Ride request not found"));

        Ride ride = request.getRide();

        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("Unauthorized: You are not the driver of this ride");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request has already been processed: " + request.getStatus());
        }

        request.setStatus(RequestStatus.REJECTED);
        return rideRequestRepository.save(request);
    }
}