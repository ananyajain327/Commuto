package Commuto.Backend.controller;

import Commuto.Backend.dto.CreateRideRequest;
import Commuto.Backend.dto.RideResponse;
import Commuto.Backend.dto.SearchRideRequest;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.User;
import Commuto.Backend.service.RideService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "http://localhost:3000")
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    // =========================
    // CREATE RIDE
    // =========================

    @PostMapping
    @PreAuthorize("hasRole('DRIVER')")
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
    @PreAuthorize("hasRole('DRIVER')")
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
}