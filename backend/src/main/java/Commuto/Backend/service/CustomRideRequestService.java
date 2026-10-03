package Commuto.Backend.service;

import Commuto.Backend.dto.CustomRideNotificationDto;
import Commuto.Backend.dto.CustomRideRequestDto;
import Commuto.Backend.entity.CustomRideRequest;
import Commuto.Backend.entity.CustomRideRequest.RequestStatus;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.CustomRideRequestRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class CustomRideRequestService {

    private final CustomRideRequestRepository customRideRequestRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public CustomRideRequestService(
            CustomRideRequestRepository customRideRequestRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.customRideRequestRepository = customRideRequestRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public CustomRideRequest createRequest(User passenger, CustomRideRequestDto dto) {
        if (dto.getStartLocation() == null || dto.getStartLocation().isBlank()) {
            throw new RuntimeException("Start location is required");
        }
        if (dto.getDestination() == null || dto.getDestination().isBlank()) {
            throw new RuntimeException("Destination is required");
        }

        CustomRideRequest request = new CustomRideRequest();
        request.setPassenger(passenger);
        request.setStartLocation(dto.getStartLocation().trim());
        request.setDestination(dto.getDestination().trim());
        request.setRideDate(dto.getRideDate() != null ? dto.getRideDate() : LocalDate.now());
        request.setDepartureTime(dto.getDepartureTime() != null ? dto.getDepartureTime() : LocalTime.now());
        request.setSeatsNeeded(dto.getSeatsNeeded() != null && dto.getSeatsNeeded() > 0 ? dto.getSeatsNeeded() : 1);
        request.setBudgetPerSeat(dto.getBudgetPerSeat() != null ? dto.getBudgetPerSeat() : 0.0);
        request.setWomenOnly(dto.getWomenOnly() != null && dto.getWomenOnly());
        request.setNote(dto.getNote());
        request.setStatus(RequestStatus.OPEN);

        CustomRideRequest saved = customRideRequestRepository.save(request);

        // Broadcast to WebSocket for live real-time notification to all drivers
        try {
            if (messagingTemplate != null) {
                CustomRideNotificationDto payload = new CustomRideNotificationDto(
                        "CUSTOM_REQUEST",
                        saved.getId(),
                        passenger.getFullName(),
                        passenger.getPhone(),
                        null,
                        null,
                        saved.getStartLocation() + " ➔ " + saved.getDestination(),
                        saved.getRideDate().toString(),
                        saved.getDepartureTime().toString(),
                        saved.getSeatsNeeded(),
                        saved.getBudgetPerSeat() * saved.getSeatsNeeded(),
                        saved.getWomenOnly(),
                        saved.getNote(),
                        "PENDING"
                );

                messagingTemplate.convertAndSend("/topic/driver/requests", payload);
                messagingTemplate.convertAndSend("/topic/custom-requests", payload);
            }
        } catch (Exception ignored) {
        }

        return saved;
    }

    public List<CustomRideRequest> getOpenRequests() {
        return customRideRequestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.OPEN);
    }

    public List<CustomRideRequest> getPassengerRequests(User passenger) {
        return customRideRequestRepository.findByPassengerOrderByCreatedAtDesc(passenger);
    }

    @Transactional
    public CustomRideRequest cancelRequest(Long requestId, User passenger) {
        CustomRideRequest request = customRideRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Ride request not found"));

        if (!request.getPassenger().getId().equals(passenger.getId())) {
            throw new RuntimeException("Unauthorized: You can only cancel your own request");
        }

        request.setStatus(RequestStatus.CANCELLED);
        return customRideRequestRepository.save(request);
    }

    @Transactional
    public CustomRideRequest acceptByDriver(Long requestId, User driver) {
        CustomRideRequest request = customRideRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Ride request not found"));

        if (request.getStatus() != RequestStatus.OPEN) {
            throw new RuntimeException("Request is no longer open");
        }

        request.setAcceptedByDriver(driver);
        request.setStatus(RequestStatus.ACCEPTED);
        CustomRideRequest saved = customRideRequestRepository.save(request);

        // Notify passenger via WebSocket
        try {
            if (messagingTemplate != null) {
                CustomRideNotificationDto payload = new CustomRideNotificationDto(
                        "REQUEST_ACCEPTED",
                        saved.getId(),
                        request.getPassenger().getFullName(),
                        request.getPassenger().getPhone(),
                        driver.getFullName(),
                        driver.getPhone(),
                        saved.getStartLocation() + " ➔ " + saved.getDestination(),
                        saved.getRideDate().toString(),
                        saved.getDepartureTime().toString(),
                        saved.getSeatsNeeded(),
                        saved.getBudgetPerSeat() * saved.getSeatsNeeded(),
                        saved.getWomenOnly(),
                        saved.getNote(),
                        "ACCEPTED"
                );

                messagingTemplate.convertAndSend("/topic/passenger/" + request.getPassenger().getId() + "/notifications", payload);
                messagingTemplate.convertAndSend("/topic/driver/requests", payload);
            }
        } catch (Exception ignored) {
        }

        return saved;
    }
}
