package Commuto.Backend.repository;

import Commuto.Backend.entity.CustomRideRequest;
import Commuto.Backend.entity.CustomRideRequest.RequestStatus;
import Commuto.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomRideRequestRepository extends JpaRepository<CustomRideRequest, Long> {

    List<CustomRideRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    List<CustomRideRequest> findByPassengerOrderByCreatedAtDesc(User passenger);

    List<CustomRideRequest> findByAcceptedByDriverOrderByCreatedAtDesc(User driver);
}
