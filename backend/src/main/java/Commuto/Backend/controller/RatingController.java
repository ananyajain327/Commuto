package Commuto.Backend.controller;

import Commuto.Backend.dto.EligibleRatingResponse;
import Commuto.Backend.dto.RatingResponse;
import Commuto.Backend.dto.SubmitRatingRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @GetMapping("/eligible")
    public List<EligibleRatingResponse> getEligibleRatings(
            @AuthenticationPrincipal User user) {
        return ratingService.getEligibleRatings(user);
    }

    @GetMapping("/received")
    public List<RatingResponse> getReceivedRatings(
            @AuthenticationPrincipal User user) {
        return ratingService.getReceivedRatings(user);
    }

    @PostMapping
    public RatingResponse submitRating(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SubmitRatingRequest request) {
        return ratingService.submitRating(
                user,
                request.getRequestId(),
                request.getScore(),
                request.getComment()
        );
    }
}