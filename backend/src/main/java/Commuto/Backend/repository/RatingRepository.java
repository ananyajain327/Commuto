package Commuto.Backend.repository;

import Commuto.Backend.entity.Rating;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    boolean existsByRequestAndRaterAndRatee(RideRequest request, User rater, User ratee);

    List<Rating> findByRateeOrderByCreatedAtDesc(User ratee);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.ratee = :ratee")
    Double findAverageScoreByRatee(@Param("ratee") User ratee);

    long countByRatee(User ratee);
}