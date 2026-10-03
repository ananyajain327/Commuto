package Commuto.Backend.repository;

import Commuto.Backend.entity.RideChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideChatMessageRepository extends JpaRepository<RideChatMessage, Long> {
    List<RideChatMessage> findByRideIdOrderBySentAtAsc(Long rideId);
}
