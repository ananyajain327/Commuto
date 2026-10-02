package Commuto.Backend.controller;

import Commuto.Backend.dto.DriverAnalyticsResponse;
import Commuto.Backend.entity.User;
import Commuto.Backend.service.DriverAnalyticsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/driver")
public class DriverAnalyticsController {

    private final DriverAnalyticsService driverAnalyticsService;

    public DriverAnalyticsController(DriverAnalyticsService driverAnalyticsService) {
        this.driverAnalyticsService = driverAnalyticsService;
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('DRIVER')")
    public DriverAnalyticsResponse getAnalytics(@AuthenticationPrincipal User driver) {
        return driverAnalyticsService.getDriverAnalytics(driver);
    }
}
