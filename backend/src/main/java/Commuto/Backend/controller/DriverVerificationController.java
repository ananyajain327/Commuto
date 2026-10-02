package Commuto.Backend.controller;

import Commuto.Backend.dto.DriverVerificationRequest;
import Commuto.Backend.dto.DriverVerificationResponse;
import Commuto.Backend.entity.User;
import Commuto.Backend.service.DriverVerificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/driver/verification")
public class DriverVerificationController {

    private final DriverVerificationService driverVerificationService;

    public DriverVerificationController(DriverVerificationService driverVerificationService) {
        this.driverVerificationService = driverVerificationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('DRIVER')")
    public DriverVerificationResponse submitVerification(
            @AuthenticationPrincipal User driver,
            @Valid @RequestBody DriverVerificationRequest request) {
        return driverVerificationService.submitVerification(driver, request);
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<DriverVerificationResponse> getStatus(
            @AuthenticationPrincipal User driver) {
        DriverVerificationResponse response = driverVerificationService.getMyVerification(driver);
        if (response == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }
}
