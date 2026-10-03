package Commuto.Backend.service;

import Commuto.Backend.dto.RideChatMessageDto;
import Commuto.Backend.dto.SendChatMessageRequest;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.RideChatMessage;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideChatMessageRepository;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.RideRequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RideChatServiceTest {

    @Mock
    private RideRepository rideRepository;

    @Mock
    private RideRequestRepository rideRequestRepository;

    @Mock
    private RideChatMessageRepository rideChatMessageRepository;

    @InjectMocks
    private RideChatService rideChatService;

    private User driver;
    private User passenger;
    private User stranger;
    private Ride ride;

    @BeforeEach
    void setUp() {
        driver = new User();
        driver.setId(1L);
        driver.setFullName("Driver John");
        driver.setRole(User.Role.DRIVER);

        passenger = new User();
        passenger.setId(2L);
        passenger.setFullName("Passenger Jane");
        passenger.setRole(User.Role.PASSENGER);

        stranger = new User();
        stranger.setId(99L);
        stranger.setFullName("Stranger Bob");
        stranger.setRole(User.Role.PASSENGER);

        ride = new Ride();
        ride.setId(10L);
        ride.setDriver(driver);
    }

    @Test
    void testDriverCanSendMessage() {
        when(rideRepository.findById(10L)).thenReturn(Optional.of(ride));
        when(rideChatMessageRepository.save(any(RideChatMessage.class))).thenAnswer(inv -> {
            RideChatMessage msg = inv.getArgument(0);
            msg.setId(100L);
            return msg;
        });

        SendChatMessageRequest req = new SendChatMessageRequest("Hello, I am at the pickup point");
        RideChatMessageDto result = rideChatService.sendMessage(10L, driver, req);

        assertNotNull(result);
        assertEquals("Hello, I am at the pickup point", result.getContent());
        assertEquals("Driver John", result.getSenderName());
    }

    @Test
    void testAcceptedPassengerCanGetChatHistory() {
        when(rideRepository.findById(10L)).thenReturn(Optional.of(ride));
        when(rideRequestRepository.existsByRideAndPassengerAndStatus(ride, passenger, RideRequest.RequestStatus.ACCEPTED))
                .thenReturn(true);

        RideChatMessage msg = new RideChatMessage(ride, driver, "On my way");
        msg.setId(101L);
        when(rideChatMessageRepository.findByRideIdOrderBySentAtAsc(10L)).thenReturn(List.of(msg));

        List<RideChatMessageDto> history = rideChatService.getRideChatHistory(10L, passenger);
        assertEquals(1, history.size());
        assertEquals("On my way", history.get(0).getContent());
    }

    @Test
    void testStrangerCannotAccessChat() {
        when(rideRepository.findById(10L)).thenReturn(Optional.of(ride));
        when(rideRequestRepository.existsByRideAndPassengerAndStatus(ride, stranger, RideRequest.RequestStatus.ACCEPTED))
                .thenReturn(false);

        assertThrows(ResponseStatusException.class, () ->
                rideChatService.getRideChatHistory(10L, stranger)
        );
    }
}
