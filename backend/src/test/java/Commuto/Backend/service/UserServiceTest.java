package Commuto.Backend.service;

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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

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
}