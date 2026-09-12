package Commuto.Backend.repository;

import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {

    List<Ride> findByDriver(User driver);

    List<Ride> findByStatus(Ride.RideStatus status);

    List<Ride> findByRideDate(LocalDate rideDate);

    List<Ride> findByStartLocationIgnoreCaseAndDestinationIgnoreCase(
            String startLocation,
            String destination
    );

    List<Ride> findByStartLocationIgnoreCaseAndDestinationIgnoreCaseAndRideDate(
            String startLocation,
            String destination,
            LocalDate rideDate
    );
}