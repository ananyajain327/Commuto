package Commuto.Backend.service;

import Commuto.Backend.dto.*;
import Commuto.Backend.entity.EmergencyContact;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.SosAlert;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.EmergencyContactRepository;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.RideRequestRepository;
import Commuto.Backend.repository.SosAlertRepository;
import Commuto.Backend.repository.UserPreferenceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SafetyService {

    private final EmergencyContactRepository emergencyContactRepository;
    private final SosAlertRepository sosAlertRepository;
    private final RideRepository rideRepository;
    private final RideRequestRepository rideRequestRepository;
    private final UserPreferenceRepository userPreferenceRepository;

    public SafetyService(
            EmergencyContactRepository emergencyContactRepository,
            SosAlertRepository sosAlertRepository,
            RideRepository rideRepository,
            RideRequestRepository rideRequestRepository,
            UserPreferenceRepository userPreferenceRepository) {
        this.emergencyContactRepository = emergencyContactRepository;
        this.sosAlertRepository = sosAlertRepository;
        this.rideRepository = rideRepository;
        this.rideRequestRepository = rideRequestRepository;
        this.userPreferenceRepository = userPreferenceRepository;
    }

    @Transactional(readOnly = true)
    public SafetySummaryResponse getSafetySummary(User user) {
        List<EmergencyContact> contactEntities = emergencyContactRepository.findByUserOrderByCreatedAtDesc(user);
        List<EmergencyContactResponse> contacts = contactEntities.stream()
                .map(EmergencyContactResponse::new)
                .toList();

        List<SosAlertResponse> activeAlerts = sosAlertRepository
                .findByUserAndStatusOrderByCreatedAtDesc(user, SosAlert.SosStatus.ACTIVE)
                .stream()
                .map(SosAlertResponse::new)
                .toList();

        boolean hasPrimaryContact = contactEntities.stream().anyMatch(EmergencyContact::isPrimary);
        boolean profileVerified = user.isActive() && user.getPhone() != null && !user.getPhone().isBlank();
        boolean hasPreferencesConfigured = userPreferenceRepository.existsByUser(user);

        int safetyScore = 50;
        if (profileVerified) {
            safetyScore += 20;
        }
        if (hasPrimaryContact) {
            safetyScore += 15;
        }
        if (contacts.size() >= 2) {
            safetyScore += 5;
        }
        if (hasPreferencesConfigured) {
            safetyScore += 10;
        }
        safetyScore = Math.min(100, safetyScore);

        return new SafetySummaryResponse(
                safetyScore,
                contacts.size(),
                profileVerified,
                hasPrimaryContact,
                hasPreferencesConfigured,
                contacts,
                activeAlerts
        );
    }

    @Transactional(readOnly = true)
    public List<EmergencyContactResponse> getEmergencyContacts(User user) {
        return emergencyContactRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(EmergencyContactResponse::new)
                .toList();
    }

    @Transactional
    public EmergencyContactResponse addEmergencyContact(User user, EmergencyContactRequest request) {
        long currentCount = emergencyContactRepository.countByUser(user);
        if (currentCount >= 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Maximum of 5 emergency contacts allowed");
        }

        boolean isFirst = currentCount == 0;
        boolean shouldBePrimary = request.isPrimary() || isFirst;

        if (shouldBePrimary) {
            emergencyContactRepository.findFirstByUserAndIsPrimaryTrue(user)
                    .ifPresent(oldPrimary -> {
                        oldPrimary.setPrimary(false);
                        emergencyContactRepository.save(oldPrimary);
                    });
        }

        EmergencyContact contact = new EmergencyContact();
        contact.setUser(user);
        contact.setName(request.getName().trim());
        contact.setPhone(request.getPhone().trim());
        contact.setRelationship(request.getRelationship().trim());
        contact.setPrimary(shouldBePrimary);

        return new EmergencyContactResponse(emergencyContactRepository.save(contact));
    }

    @Transactional
    public void deleteEmergencyContact(User user, Long contactId) {
        EmergencyContact contact = emergencyContactRepository.findByIdAndUser(contactId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Emergency contact not found"));

        boolean wasPrimary = contact.isPrimary();
        emergencyContactRepository.delete(contact);

        if (wasPrimary) {
            List<EmergencyContact> remaining = emergencyContactRepository.findByUserOrderByCreatedAtDesc(user);
            if (!remaining.isEmpty()) {
                EmergencyContact newPrimary = remaining.get(0);
                newPrimary.setPrimary(true);
                emergencyContactRepository.save(newPrimary);
            }
        }
    }

    @Transactional
    public SosAlertResponse triggerSos(User user, SosTriggerRequest request) {
        Ride ride = null;
        if (request != null && request.getRideId() != null) {
            ride = rideRepository.findById(request.getRideId()).orElse(null);
        }

        SosAlert alert = new SosAlert();
        alert.setUser(user);
        alert.setRide(ride);
        if (request != null) {
            alert.setLatitude(request.getLatitude());
            alert.setLongitude(request.getLongitude());
            if (request.getMessage() != null && !request.getMessage().isBlank()) {
                alert.setMessage(request.getMessage().trim());
            } else {
                alert.setMessage("Emergency SOS activated by " + user.getFullName());
            }
        } else {
            alert.setMessage("Emergency SOS activated by " + user.getFullName());
        }
        alert.setStatus(SosAlert.SosStatus.ACTIVE);

        return new SosAlertResponse(sosAlertRepository.save(alert));
    }

    @Transactional
    public SosAlertResponse triggerRideSos(User user, Long rideId, SosTriggerRequest request) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ride not found"));

        boolean isDriver = ride.getDriver().getId().equals(user.getId());
        boolean isPassenger = rideRequestRepository.existsByRideAndPassengerAndStatus(
                ride,
                user,
                RideRequest.RequestStatus.ACCEPTED
        );

        if (!isDriver && !isPassenger && user.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only ride participants or administrators can trigger an SOS for this ride"
            );
        }

        SosAlert alert = new SosAlert();
        alert.setUser(user);
        alert.setRide(ride);

        if (request != null) {
            alert.setLatitude(request.getLatitude());
            alert.setLongitude(request.getLongitude());
        }

        StringBuilder msg = new StringBuilder();
        msg.append("EMERGENCY SOS: Triggered by ")
                .append(user.getFullName())
                .append(" (").append(user.getRole()).append(", Phone: ").append(user.getPhone()).append(")")
                .append(" on Ride #").append(ride.getId())
                .append(" [").append(ride.getStartLocation()).append(" -> ").append(ride.getDestination()).append("]");

        if (isPassenger) {
            msg.append(" | Driver: ").append(ride.getDriver().getFullName())
                    .append(" (Phone: ").append(ride.getDriver().getPhone()).append(")")
                    .append(", Vehicle: ").append(ride.getVehicleModel()).append(" (").append(ride.getVehicleNumber()).append(")");
        } else if (isDriver) {
            msg.append(" | Driver in distress. Vehicle: ")
                    .append(ride.getVehicleModel()).append(" (").append(ride.getVehicleNumber()).append(")");
        }

        if (request != null && request.getMessage() != null && !request.getMessage().isBlank()) {
            msg.append(" | Note: ").append(request.getMessage().trim());
        }

        alert.setMessage(msg.toString());
        alert.setStatus(SosAlert.SosStatus.ACTIVE);

        return new SosAlertResponse(sosAlertRepository.save(alert));
    }

    @Transactional
    public SosAlertResponse resolveSos(User user, Long alertId) {
        SosAlert alert;
        if (user.getRole() == User.Role.ADMIN) {
            alert = sosAlertRepository.findById(alertId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SOS alert not found"));
        } else {
            alert = sosAlertRepository.findByIdAndUser(alertId, user)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SOS alert not found"));
        }

        alert.setStatus(SosAlert.SosStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());
        return new SosAlertResponse(sosAlertRepository.save(alert));
    }

    @Transactional(readOnly = true)
    public List<SosAlertResponse> getActiveSosAlerts() {
        return sosAlertRepository.findByStatusOrderByCreatedAtDesc(SosAlert.SosStatus.ACTIVE).stream()
                .map(SosAlertResponse::new)
                .toList();
    }
}
