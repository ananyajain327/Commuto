package Commuto.Backend.service;
import Commuto.Backend.dto.SearchRideRequest;
import Commuto.Backend.dto.CreateRideRequest;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RideService {

    private final RideRepository rideRepository;

    public RideService(RideRepository rideRepository) {
        this.rideRepository = rideRepository;
    }

    public Ride createRide(User driver, CreateRideRequest request) {

        if (driver.getRole() != User.Role.DRIVER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only drivers can create rides");
        }

        if (!driver.isActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Driver account is inactive");
        }

        if (!driver.isVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Driver account is not verified. Please submit documents for verification first.");
        }

        Ride ride = new Ride();

        ride.setDriver(driver);
        ride.setStartLocation(request.getStartLocation());
        ride.setDestination(request.getDestination());
        ride.setRideDate(request.getRideDate());
        ride.setDepartureTime(request.getDepartureTime());
        ride.setAvailableSeats(request.getAvailableSeats());
        ride.setExpectedFare(request.getExpectedFare());
        ride.setVehicleModel(request.getVehicleModel());
        ride.setVehicleNumber(request.getVehicleNumber());
        ride.setWomenOnly(request.isWomenOnly());
        ride.setNotes(request.getNotes());

        ride.setStatus(Ride.RideStatus.UPCOMING);

        return rideRepository.save(ride);
    }

    public List<Ride> getRidesByDriver(User driver) {
        return rideRepository.findByDriver(driver);
    }

    public Ride getRideById(Long id) {
        return rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
    }

    public Ride startRide(Long rideId, User driver) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ride not found"));

        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not the driver of this ride");
        }

        if (ride.getStatus() != Ride.RideStatus.UPCOMING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ride can only be started from UPCOMING status");
        }

        if (ride.getRideDate() != null && ride.getDepartureTime() != null) {
            java.time.LocalDateTime scheduledDeparture = java.time.LocalDateTime.of(ride.getRideDate(), ride.getDepartureTime());
            if (java.time.LocalDateTime.now().isBefore(scheduledDeparture)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Ride cannot be started before scheduled departure date and time (" + ride.getRideDate() + " at " + ride.getDepartureTime() + ")"
                );
            }
        }

        ride.setStatus(Ride.RideStatus.ACTIVE);
        return rideRepository.save(ride);
    }

    public Ride completeRide(Long rideId, User driver) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("You are not the driver of this ride");
        }

        if (ride.getStatus() != Ride.RideStatus.ACTIVE) {
            throw new RuntimeException("Ride can only be completed from ACTIVE status");
        }

        ride.setStatus(Ride.RideStatus.COMPLETED);
        return rideRepository.save(ride);
    }

    public List<Ride> searchRides(SearchRideRequest request) {

        if (request.getRideDate() != null) {
            return rideRepository
                    .findByStartLocationIgnoreCaseAndDestinationIgnoreCaseAndRideDate(
                            request.getStartLocation(),
                            request.getDestination(),
                            request.getRideDate()
                    );
        }

        return rideRepository
                .findByStartLocationIgnoreCaseAndDestinationIgnoreCase(
                        request.getStartLocation(),
                        request.getDestination()
                );
    }
}