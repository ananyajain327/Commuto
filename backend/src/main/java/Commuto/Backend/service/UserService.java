package Commuto.Backend.service;
import Commuto.Backend.dto.LoginRequest;
import Commuto.Backend.dto.RegisterRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import Commuto.Backend.dto.UpdateProfileRequest;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
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
            Commuto.Backend.dto.ChangePasswordRequest request) {

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Current password is incorrect"
            );
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}