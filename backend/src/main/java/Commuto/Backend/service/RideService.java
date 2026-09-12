package Commuto.Backend.service;
import Commuto.Backend.dto.SearchRideRequest;
import Commuto.Backend.dto.CreateRideRequest;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RideService {

    private final RideRepository rideRepository;

    public RideService(RideRepository rideRepository) {
        this.rideRepository = rideRepository;
    }

    public Ride createRide(User driver, CreateRideRequest request) {

        if (driver.getRole() != User.Role.DRIVER) {
            throw new RuntimeException("Only drivers can create rides");
        }

        if (!driver.isActive()) {
            throw new RuntimeException("Driver account is inactive");
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