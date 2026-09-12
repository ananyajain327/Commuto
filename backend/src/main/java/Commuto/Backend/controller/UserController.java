package Commuto.Backend.controller;

import Commuto.Backend.dto.UpdateProfileRequest;
import Commuto.Backend.dto.UserResponse;
import Commuto.Backend.entity.User;
import Commuto.Backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // GET CURRENT USER
    // =========================

    @GetMapping("/me")
    public UserResponse getCurrentUser(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return new UserResponse(user);
    }

    // =========================
    // UPDATE CURRENT USER
    // =========================

    @PutMapping("/me")
    public UserResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {

        User user = (User) authentication.getPrincipal();

        User updatedUser =
                userService.updateProfile(user, request);

        return new UserResponse(updatedUser);
    }
}