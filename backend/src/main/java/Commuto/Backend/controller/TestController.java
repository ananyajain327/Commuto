package Commuto.Backend.controller;

import Commuto.Backend.entity.User;
import org.springframework.security.core.Authentication;
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
}