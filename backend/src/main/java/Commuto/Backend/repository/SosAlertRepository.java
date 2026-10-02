package Commuto.Backend.repository;

import Commuto.Backend.entity.SosAlert;
import Commuto.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosAlertRepository extends JpaRepository<SosAlert, Long> {

    List<SosAlert> findByUserOrderByCreatedAtDesc(User user);

    List<SosAlert> findByUserAndStatusOrderByCreatedAtDesc(User user, SosAlert.SosStatus status);

    List<SosAlert> findByStatusOrderByCreatedAtDesc(SosAlert.SosStatus status);

    Optional<SosAlert> findByIdAndUser(Long id, User user);
}
