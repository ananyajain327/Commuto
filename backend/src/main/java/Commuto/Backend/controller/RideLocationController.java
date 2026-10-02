package Commuto.Backend.controller;

import Commuto.Backend.dto.RideLocationMessage;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.Instant;

@Controller
public class RideLocationController {

    private final RideRepository rideRepository;

    public RideLocationController(RideRepository rideRepository) {
        this.rideRepository = rideRepository;
    }

    @MessageMapping("/ride/{rideId}/location")
    @SendTo("/topic/ride/{rideId}/location")
    public RideLocationMessage updateLocation(
            @DestinationVariable Long rideId,
            @Payload RideLocationMessage location,
            Principal principal) {

        if (!(principal instanceof Authentication authentication)
                || !(authentication.getPrincipal() instanceof User driver)
                || driver.getRole() != User.Role.DRIVER) {
            throw new AccessDeniedException("Only the ride driver can publish location updates");
        }

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found"));
        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new AccessDeniedException("You are not the driver of this ride");
        }
        if (ride.getStatus() != Ride.RideStatus.ACTIVE) {
            throw new IllegalStateException("Location updates are only allowed during an active ride");
        }
        if (location == null
                || !Double.isFinite(location.latitude())
                || location.latitude() < -90 || location.latitude() > 90
                || !Double.isFinite(location.longitude())
                || location.longitude() < -180 || location.longitude() > 180
                || !Double.isFinite(location.heading())
                || !Double.isFinite(location.speed())) {
            throw new IllegalArgumentException("The location update is invalid");
        }

        return new RideLocationMessage(
                rideId,
                driver.getId(),
                location.latitude(),
                location.longitude(),
                location.heading(),
                location.speed(),
                Instant.now()
        );
    }
}