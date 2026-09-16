package Commuto.Backend.repository;

import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideRequestRepository
        extends JpaRepository<RideRequest, Long> {

    List<RideRequest> findByPassenger(User passenger);

    List<RideRequest> findByRide(Ride ride);

    List<RideRequest> findByRideAndStatus(
            Ride ride,
            RideRequest.RequestStatus status
    );

    boolean existsByRideAndPassenger(
            Ride ride,
            User passenger
    );
}