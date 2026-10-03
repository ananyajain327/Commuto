package Commuto.Backend.controller;

import Commuto.Backend.dto.CustomRideRequestDto;
import Commuto.Backend.entity.CustomRideRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.service.CustomRideRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/custom-ride-requests")
public class CustomRideRequestController {

    private final CustomRideRequestService customRideRequestService;

    public CustomRideRequestController(CustomRideRequestService customRideRequestService) {
        this.customRideRequestService = customRideRequestService;
    }

    @PostMapping
    @PreAuthorize("hasRole('PASSENGER')")
    public ResponseEntity<CustomRideRequest> createCustomRequest(
            @RequestBody CustomRideRequestDto dto,
            @AuthenticationPrincipal User passenger) {

        if (passenger == null) {
            throw new RuntimeException("Unauthorized: Passenger not found");
        }

        CustomRideRequest created = customRideRequestService.createRequest(passenger, dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/open")
    @PreAuthorize("hasRole('DRIVER') or hasRole('ADMIN')")
    public ResponseEntity<List<CustomRideRequest>> getOpenRequests() {
        return ResponseEntity.ok(customRideRequestService.getOpenRequests());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PASSENGER')")
    public ResponseEntity<List<CustomRideRequest>> getMyCustomRequests(
            @AuthenticationPrincipal User passenger) {

        if (passenger == null) {
            throw new RuntimeException("Unauthorized: Passenger not found");
        }

        return ResponseEntity.ok(customRideRequestService.getPassengerRequests(passenger));
    }

    @PutMapping("/{requestId}/cancel")
    @PreAuthorize("hasRole('PASSENGER')")
    public ResponseEntity<CustomRideRequest> cancelCustomRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal User passenger) {

        if (passenger == null) {
            throw new RuntimeException("Unauthorized: Passenger not found");
        }

        return ResponseEntity.ok(customRideRequestService.cancelRequest(requestId, passenger));
    }

    @PutMapping("/{requestId}/accept")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<CustomRideRequest> acceptCustomRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal User driver) {

        if (driver == null) {
            throw new RuntimeException("Unauthorized: Driver not found");
        }

        return ResponseEntity.ok(customRideRequestService.acceptByDriver(requestId, driver));
    }
}
