package Commuto.Backend.security;

import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.RideRequestRepository;
import Commuto.Backend.repository.UserRepository;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.List;

@Component
public class JwtStompInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final RideRequestRepository rideRequestRepository;

    public JwtStompInterceptor(
            JwtService jwtService,
            UserRepository userRepository,
            RideRepository rideRepository,
            RideRequestRepository rideRequestRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
        this.rideRequestRepository = rideRequestRepository;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(
                message,
                StompHeaderAccessor.class
        );
        if (accessor == null) {
            return message;
        }

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            authenticate(accessor);
        } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            authorizeSubscription(accessor);
        }

        return message;
    }

    private void authenticate(StompHeaderAccessor accessor) {
        String authorization = accessor.getFirstNativeHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new AccessDeniedException("A bearer token is required");
        }

        String email;
        try {
            email = jwtService.extractEmail(authorization.substring(7));
        } catch (RuntimeException exception) {
            throw new AccessDeniedException("The bearer token is invalid");
        }

        User user = userRepository.findByEmail(email)
                .filter(User::isActive)
                .orElseThrow(() -> new AccessDeniedException("The user is unavailable"));

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
        accessor.setUser(authentication);
    }

    private void authorizeSubscription(StompHeaderAccessor accessor) {
        String destination = accessor.getDestination();
        if (destination == null || !destination.startsWith("/topic/ride/")
                || !destination.endsWith("/location")) {
            throw new AccessDeniedException("The subscription destination is not allowed");
        }

        Principal principal = accessor.getUser();
        if (!(principal instanceof Authentication authentication)
                || !(authentication.getPrincipal() instanceof User user)) {
            throw new AccessDeniedException("Authentication is required");
        }

        String rideIdValue = destination.substring("/topic/ride/".length(), destination.length() - "/location".length());
        long rideId;
        try {
            rideId = Long.parseLong(rideIdValue);
        } catch (NumberFormatException exception) {
            throw new AccessDeniedException("The ride destination is invalid");
        }

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new AccessDeniedException("The ride is unavailable"));

        boolean isDriver = user.getRole() == User.Role.DRIVER
                && ride.getDriver().getId().equals(user.getId());
        boolean isAcceptedPassenger = user.getRole() == User.Role.PASSENGER
                && rideRequestRepository.existsByRideAndPassengerAndStatus(
                        ride,
                        user,
                        RideRequest.RequestStatus.ACCEPTED
                );

        if (!isDriver && !isAcceptedPassenger) {
            throw new AccessDeniedException("You are not a participant in this ride");
        }
    }
}