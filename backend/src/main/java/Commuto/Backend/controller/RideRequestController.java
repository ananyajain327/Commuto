package Commuto.Backend.controller;

import Commuto.Backend.dto.RideBookingRequest;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.service.RideRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ride-requests")
public class RideRequestController {

    private final RideRequestService rideRequestService;

    public RideRequestController(RideRequestService rideRequestService) {
        this.rideRequestService = rideRequestService;
    }

    @PostMapping
    @PreAuthorize("hasRole('PASSENGER')")
    public ResponseEntity<RideRequest> createRequest(
            @RequestBody RideBookingRequest requestDto,
            @AuthenticationPrincipal User passenger) {

        if (passenger == null) {
            throw new RuntimeException("Unauthorized: Passenger not found");
        }

        RideRequest request = rideRequestService.createRequest(
                passenger,
                requestDto.getRideId(),
                requestDto.getSeatsRequested(),
                requestDto.getPickupPreference(),
                requestDto.getNote()
        );

        return ResponseEntity.ok(request);
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('PASSENGER')")
    public ResponseEntity<List<RideRequest>> getMyRequests(
            @AuthenticationPrincipal User passenger) {

        if (passenger == null) {
            throw new RuntimeException("Unauthorized: Passenger not found");
        }

        return ResponseEntity.ok(
                rideRequestService.getPassengerRequests(passenger)
        );
    }

    @GetMapping("/ride/{rideId}")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<RideRequest>> getRideRequests(
            @PathVariable Long rideId,
            @AuthenticationPrincipal User driver) {

        if (driver == null) {
            throw new RuntimeException("Unauthorized: Driver not found");
        }

        return ResponseEntity.ok(
                rideRequestService.getRideRequestsForDriver(rideId, driver)
        );
    }

    @PutMapping("/{requestId}/accept")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<RideRequest> acceptRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal User driver) {

        if (driver == null) {
            throw new RuntimeException("Unauthorized: Driver not found");
        }

        return ResponseEntity.ok(
                rideRequestService.acceptRequest(requestId, driver)
        );
    }

    @PutMapping("/{requestId}/reject")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<RideRequest> rejectRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal User driver) {

        if (driver == null) {
            throw new RuntimeException("Unauthorized: Driver not found");
        }

        return ResponseEntity.ok(
                rideRequestService.rejectRequest(requestId, driver)
        );
    }
}