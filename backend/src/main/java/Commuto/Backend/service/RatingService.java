package Commuto.Backend.service;

import Commuto.Backend.dto.EligibleRatingResponse;
import Commuto.Backend.dto.RatingResponse;
import Commuto.Backend.entity.Rating;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RatingRepository;
import Commuto.Backend.repository.RideRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
public class RatingService {

    private final RideRequestRepository rideRequestRepository;
    private final RatingRepository ratingRepository;

    public RatingService(
            RideRequestRepository rideRequestRepository,
            RatingRepository ratingRepository) {
        this.rideRequestRepository = rideRequestRepository;
        this.ratingRepository = ratingRepository;
    }

    @Transactional(readOnly = true)
    public List<EligibleRatingResponse> getEligibleRatings(User rater) {
        List<RideRequest> requests = switch (rater.getRole()) {
            case PASSENGER -> rideRequestRepository.findByPassengerAndStatusOrderByCreatedAtDesc(
                    rater,
                    RideRequest.RequestStatus.ACCEPTED
            );
            case DRIVER -> rideRequestRepository.findByRide_DriverAndStatusOrderByCreatedAtDesc(
                    rater,
                    RideRequest.RequestStatus.ACCEPTED
            );
            case ADMIN -> throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        };

        return requests.stream()
                .filter(request -> request.getRide().getStatus() == Ride.RideStatus.COMPLETED)
                .filter(request -> !ratingRepository.existsByRequestAndRaterAndRatee(
                        request,
                        rater,
                        getRatee(request, rater)
                ))
                .map(request -> new EligibleRatingResponse(
                        request,
                        getRatee(request, rater).getFullName()
                ))
                .toList();
    }

    @Transactional
    public RatingResponse submitRating(User rater, Long requestId, int score, String comment) {
        if (score < 1 || score > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be from 1 to 5");
        }

        RideRequest request = rideRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ride request not found"));
        if (request.getStatus() != RideRequest.RequestStatus.ACCEPTED
                || request.getRide().getStatus() != Ride.RideStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only completed accepted rides can be rated");
        }

        User ratee = getRatee(request, rater);
        if (ratingRepository.existsByRequestAndRaterAndRatee(request, rater, ratee)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already rated this ride");
        }

        Rating rating = new Rating();
        rating.setRequest(request);
        rating.setRater(rater);
        rating.setRatee(ratee);
        rating.setScore(score);
        rating.setComment(comment.trim());
        Rating savedRating = ratingRepository.save(rating);

        Double averageScore = ratingRepository.findAverageScoreByRatee(ratee);
        double roundedAverage = averageScore != null ? Math.round(averageScore * 10.0) / 10.0 : (double) score;

        return new RatingResponse(savedRating, roundedAverage);
    }

    @Transactional(readOnly = true)
    public List<RatingResponse> getReceivedRatings(User ratee) {
        return ratingRepository.findByRateeOrderByCreatedAtDesc(ratee).stream()
                .map(RatingResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public Double getAverageRating(User user) {
        Double avg = ratingRepository.findAverageScoreByRatee(user);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 5.0;
    }

    @Transactional(readOnly = true)
    public long getRatingCount(User user) {
        return ratingRepository.countByRatee(user);
    }

    private User getRatee(RideRequest request, User rater) {
        if (Objects.equals(request.getPassenger().getId(), rater.getId())) {
            return request.getRide().getDriver();
        }
        if (Objects.equals(request.getRide().getDriver().getId(), rater.getId())) {
            return request.getPassenger();
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only ride participants can submit ratings");
    }
}