package Commuto.Backend.repository;

import Commuto.Backend.entity.Rating;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    boolean existsByRequestAndRaterAndRatee(RideRequest request, User rater, User ratee);

    List<Rating> findByRateeOrderByCreatedAtDesc(User ratee);
}