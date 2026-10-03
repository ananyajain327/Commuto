package Commuto.Backend.service;

import Commuto.Backend.dto.GoogleAuthRequest;
import Commuto.Backend.dto.LoginRequest;
import Commuto.Backend.dto.RegisterRequest;
import Commuto.Backend.dto.UpdateProfileRequest;
import Commuto.Backend.dto.ChangePasswordRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final GoogleAuthVerifierService googleAuthVerifierService;

    public UserService(
            UserRepository userRepository,
            GoogleAuthVerifierService googleAuthVerifierService) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.googleAuthVerifierService = googleAuthVerifierService;
    }

    public User registerUser(RegisterRequest request) {

        if (request.getRole() == User.Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Administrator accounts cannot be created through public registration"
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // Never store plain-text passwords
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(request.getRole());
        user.setGender(request.getGender());
        user.setActive(true);

        return userRepository.save(user);
    }

    public User loginUser(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Account is inactive");
        }

        return user;
    }

    public User updateProfile(
            User user,
            UpdateProfileRequest request) {

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        return userRepository.save(user);
    }

    public void changePassword(
            User user,
            ChangePasswordRequest request) {

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Current password is incorrect"
            );
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public User googleAuth(GoogleAuthRequest request) {
        GoogleAuthVerifierService.VerifiedGoogleUser verifiedUser =
                googleAuthVerifierService.verifyToken(request.getIdToken(), request.getAccessToken());

        String verifiedEmail = verifiedUser.getEmail();

        return userRepository.findByEmail(verifiedEmail).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(verifiedEmail);
            newUser.setFullName(verifiedUser.getFullName());
            newUser.setPhone(request.getPhone() != null && !request.getPhone().isBlank()
                    ? request.getPhone().trim()
                    : "+919" + (int)(10000000 + Math.random() * 90000000));
            newUser.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));

            // Never allow public Google registration to elevate to ADMIN
            User.Role role = request.getRole();
            if (role == null || role == User.Role.ADMIN) {
                role = User.Role.PASSENGER;
            }
            newUser.setRole(role);
            if (request.getGender() != null) {
                newUser.setGender(request.getGender());
            }
            newUser.setActive(true);
            newUser.setVerified(true);
            return userRepository.save(newUser);
        });
    }
}