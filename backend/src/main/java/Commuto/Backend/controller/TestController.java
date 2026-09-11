package Commuto.Backend.controller;

import Commuto.Backend.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/protected")
    public String protectedEndpoint(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return "JWT Authentication Successful! Logged in as: "
                + user.getEmail()
                + " | Role: "
                + user.getRole().name();
    }

    @GetMapping("/passenger")
    @PreAuthorize("hasRole('PASSENGER')")
    public String passengerEndpoint() {
        return "Passenger access granted!";
    }

    @GetMapping("/driver")
    @PreAuthorize("hasRole('DRIVER')")
    public String driverEndpoint() {
        return "Driver access granted!";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminEndpoint() {
        return "Admin access granted!";
    }
}