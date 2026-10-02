package Commuto.Backend.repository;

import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideRequestRepository extends JpaRepository<RideRequest, Long> {

    boolean existsByRideAndPassenger(Ride ride, User passenger);

    List<RideRequest> findByPassengerOrderByCreatedAtDesc(User passenger);

    List<RideRequest> findByRideOrderByCreatedAtDesc(Ride ride);

    boolean existsByRideAndPassengerAndStatus(
            Ride ride,
            User passenger,
            RideRequest.RequestStatus status
    );
}