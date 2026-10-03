package Commuto.Backend.service;

import Commuto.Backend.dto.RideChatMessageDto;
import Commuto.Backend.dto.SendChatMessageRequest;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.RideChatMessage;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideChatMessageRepository;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.RideRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RideChatService {

    private final RideRepository rideRepository;
    private final RideRequestRepository rideRequestRepository;
    private final RideChatMessageRepository rideChatMessageRepository;

    public RideChatService(
            RideRepository rideRepository,
            RideRequestRepository rideRequestRepository,
            RideChatMessageRepository rideChatMessageRepository) {
        this.rideRepository = rideRepository;
        this.rideRequestRepository = rideRequestRepository;
        this.rideChatMessageRepository = rideChatMessageRepository;
    }

    private void validateUserAccess(User user, Ride ride) {
        if (user.getRole() == User.Role.ADMIN) {
            return;
        }

        boolean isDriver = ride.getDriver().getId().equals(user.getId());
        if (isDriver) {
            return;
        }

        boolean isAcceptedPassenger = rideRequestRepository
                .existsByRideAndPassengerAndStatus(ride, user, RideRequest.RequestStatus.ACCEPTED);

        if (!isAcceptedPassenger) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Access denied: you must be the driver or an accepted passenger of this ride"
            );
        }
    }

    @Transactional(readOnly = true)
    public List<RideChatMessageDto> getRideChatHistory(Long rideId, User user) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ride not found"));

        validateUserAccess(user, ride);

        return rideChatMessageRepository.findByRideIdOrderBySentAtAsc(rideId)
                .stream()
                .map(RideChatMessageDto::new)
                .toList();
    }

    @Transactional
    public RideChatMessageDto sendMessage(Long rideId, User user, SendChatMessageRequest request) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ride not found"));

        validateUserAccess(user, ride);

        RideChatMessage message = new RideChatMessage(
                ride,
                user,
                request.getContent().trim()
        );

        RideChatMessage saved = rideChatMessageRepository.save(message);
        return new RideChatMessageDto(saved);
    }
}
