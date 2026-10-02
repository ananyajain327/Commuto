package Commuto.Backend.repository;

import Commuto.Backend.entity.EmergencyContact;
import Commuto.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {

    List<EmergencyContact> findByUserOrderByCreatedAtDesc(User user);

    Optional<EmergencyContact> findByIdAndUser(Long id, User user);

    long countByUser(User user);

    Optional<EmergencyContact> findFirstByUserAndIsPrimaryTrue(User user);
}
