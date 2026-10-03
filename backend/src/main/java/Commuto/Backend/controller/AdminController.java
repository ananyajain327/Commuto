package Commuto.Backend.controller;

import Commuto.Backend.dto.AdminOverviewResponse;
import Commuto.Backend.dto.DriverVerificationResponse;
import Commuto.Backend.dto.UserResponse;
import Commuto.Backend.dto.VerificationReviewRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.service.AdminService;
import Commuto.Backend.service.DriverVerificationService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final DriverVerificationService driverVerificationService;

    public AdminController(
            AdminService adminService,
            DriverVerificationService driverVerificationService) {
        this.adminService = adminService;
        this.driverVerificationService = driverVerificationService;
    }

    @GetMapping("/overview")
    public AdminOverviewResponse getOverview() {
        return adminService.getOverview();
    }

    @GetMapping("/verifications")
    public List<DriverVerificationResponse> getVerifications(
            @RequestParam(required = false, defaultValue = "false") boolean pendingOnly) {
        if (pendingOnly) {
            return driverVerificationService.getPendingVerifications();
        }
        return driverVerificationService.getAllVerifications();
    }

    @PostMapping("/verifications/{id}/review")
    public DriverVerificationResponse reviewVerification(
            @AuthenticationPrincipal User admin,
            @PathVariable Long id,
            @Valid @RequestBody VerificationReviewRequest request) {
        return driverVerificationService.reviewVerification(id, admin, request);
    }

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/rides")
    public List<RideResponse> getAllRides() {
        return adminService.getAllRides();
    }
}
