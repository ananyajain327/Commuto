package Commuto.Backend.controller;

import Commuto.Backend.dto.UserResponse;
import Commuto.Backend.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/me")
    public UserResponse getCurrentUser(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return new UserResponse(user);
    }
}