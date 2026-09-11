package Commuto.Backend.controller;

import Commuto.Backend.dto.LoginRequest;
import Commuto.Backend.dto.LoginResponse;
import Commuto.Backend.dto.RegisterRequest;
import Commuto.Backend.dto.UserResponse;
import Commuto.Backend.entity.User;
import Commuto.Backend.security.JwtService;
import Commuto.Backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(
            UserService userService,
            JwtService jwtService) {

        this.userService = userService;
        this.jwtService = jwtService;
    }

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        User user = userService.registerUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new UserResponse(user));
    }

    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        User user = userService.loginUser(request);

        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(
                new LoginResponse(token, user)
        );
    }
}