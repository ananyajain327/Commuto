package Commuto.Backend.repository;

import Commuto.Backend.entity.DriverVerification;
import Commuto.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverVerificationRepository extends JpaRepository<DriverVerification, Long> {

    Optional<DriverVerification> findByDriver(User driver);

    List<DriverVerification> findByStatusOrderBySubmittedAtAsc(DriverVerification.VerificationStatus status);

    List<DriverVerification> findAllByOrderBySubmittedAtDesc();

    long countByStatus(DriverVerification.VerificationStatus status);
}
