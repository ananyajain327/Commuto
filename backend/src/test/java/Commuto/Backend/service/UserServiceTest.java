package Commuto.Backend.service;

import Commuto.Backend.dto.GoogleAuthRequest;
import Commuto.Backend.dto.RegisterRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private GoogleAuthVerifierService googleAuthVerifierService;

    @InjectMocks
    private UserService userService;

    @Test
    void publicRegistrationCannotCreateAdministratorAccounts() {
        RegisterRequest request = new RegisterRequest();
        request.setRole(User.Role.ADMIN);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> userService.registerUser(request)
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        verifyNoInteractions(userRepository);
    }

    @Test
    void googleAuthWithValidTokenAuthenticatesUser() {
        GoogleAuthRequest request = new GoogleAuthRequest("valid-google-id-token");
        GoogleAuthVerifierService.VerifiedGoogleUser verifiedUser =
                new GoogleAuthVerifierService.VerifiedGoogleUser("verified@gmail.com", "Verified User", "sub123");

        when(googleAuthVerifierService.verifyToken("valid-google-id-token", null))
                .thenReturn(verifiedUser);

        User existingUser = new User();
        existingUser.setEmail("verified@gmail.com");
        existingUser.setFullName("Verified User");
        existingUser.setRole(User.Role.PASSENGER);

        when(userRepository.findByEmail("verified@gmail.com")).thenReturn(Optional.of(existingUser));

        User result = userService.googleAuth(request);

        assertEquals("verified@gmail.com", result.getEmail());
    }

    @Test
    void googleAuthRejectsUnverifiedToken() {
        GoogleAuthRequest request = new GoogleAuthRequest("invalid-token");

        when(googleAuthVerifierService.verifyToken("invalid-token", null))
                .thenThrow(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token"));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> userService.googleAuth(request)
        );

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
        verifyNoInteractions(userRepository);
    }
}