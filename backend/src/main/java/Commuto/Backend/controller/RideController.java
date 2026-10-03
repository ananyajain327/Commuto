package Commuto.Backend.controller;

import Commuto.Backend.dto.CreateRideRequest;
import Commuto.Backend.dto.RideResponse;
import Commuto.Backend.dto.SearchRideRequest;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.User;
import Commuto.Backend.dto.SosAlertResponse;
import Commuto.Backend.dto.SosTriggerRequest;
import Commuto.Backend.service.RideService;
import Commuto.Backend.service.SafetyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    private final RideService rideService;
    private final SafetyService safetyService;

    public RideController(RideService rideService, SafetyService safetyService) {
        this.rideService = rideService;
        this.safetyService = safetyService;
    }

    // =========================
    // CREATE RIDE
    // =========================

    @PostMapping
    public ResponseEntity<RideResponse> createRide(
            Authentication authentication,
            @Valid @RequestBody CreateRideRequest request) {

        User driver = (User) authentication.getPrincipal();

        Ride ride = rideService.createRide(driver, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new RideResponse(ride));
    }

    // =========================
    // GET MY RIDES
    // =========================

    @GetMapping("/my-rides")
    public ResponseEntity<List<RideResponse>> getMyRides(
            Authentication authentication) {

        User driver = (User) authentication.getPrincipal();

        List<RideResponse> rides = rideService
                .getRidesByDriver(driver)
                .stream()
                .map(RideResponse::new)
                .toList();

        return ResponseEntity.ok(rides);
    }

    // =========================
    // SEARCH RIDES
    // =========================

    @PostMapping("/search")
    public ResponseEntity<List<RideResponse>> searchRides(
            @Valid @RequestBody SearchRideRequest request) {

        List<RideResponse> rides = rideService
                .searchRides(request)
                .stream()
                .map(RideResponse::new)
                .toList();

        return ResponseEntity.ok(rides);
    }

    // =========================
    // GET RIDE BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<RideResponse> getRideById(
            @PathVariable Long id) {

        Ride ride = rideService.getRideById(id);

        return ResponseEntity.ok(new RideResponse(ride));
    }

    @PutMapping("/{id}/start")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<RideResponse> startRide(
            Authentication authentication,
            @PathVariable Long id) {

        User driver = (User) authentication.getPrincipal();
        Ride ride = rideService.startRide(id, driver);

        return ResponseEntity.ok(new RideResponse(ride));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<RideResponse> completeRide(
            Authentication authentication,
            @PathVariable Long id) {

        User driver = (User) authentication.getPrincipal();
        Ride ride = rideService.completeRide(id, driver);

        return ResponseEntity.ok(new RideResponse(ride));
    }

    @PostMapping("/{id}/sos")
    public ResponseEntity<SosAlertResponse> triggerRideSos(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody(required = false) SosTriggerRequest request) {

        User user = (User) authentication.getPrincipal();
        SosAlertResponse response = safetyService.triggerRideSos(user, id, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}