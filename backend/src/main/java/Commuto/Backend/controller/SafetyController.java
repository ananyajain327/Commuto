package Commuto.Backend.controller;

import Commuto.Backend.dto.EmergencyContactRequest;
import Commuto.Backend.dto.EmergencyContactResponse;
import Commuto.Backend.dto.SafetySummaryResponse;
import Commuto.Backend.dto.SosAlertResponse;
import Commuto.Backend.dto.SosTriggerRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.service.SafetyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/safety")
public class SafetyController {

    private final SafetyService safetyService;

    public SafetyController(SafetyService safetyService) {
        this.safetyService = safetyService;
    }

    @GetMapping("/summary")
    public SafetySummaryResponse getSafetySummary(@AuthenticationPrincipal User user) {
        return safetyService.getSafetySummary(user);
    }

    @GetMapping("/contacts")
    public List<EmergencyContactResponse> getEmergencyContacts(@AuthenticationPrincipal User user) {
        return safetyService.getEmergencyContacts(user);
    }

    @PostMapping("/contacts")
    @ResponseStatus(HttpStatus.CREATED)
    public EmergencyContactResponse addEmergencyContact(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody EmergencyContactRequest request) {
        return safetyService.addEmergencyContact(user, request);
    }

    @DeleteMapping("/contacts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmergencyContact(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        safetyService.deleteEmergencyContact(user, id);
    }

    @PostMapping("/sos")
    @ResponseStatus(HttpStatus.CREATED)
    public SosAlertResponse triggerSos(
            @AuthenticationPrincipal User user,
            @RequestBody(required = false) SosTriggerRequest request) {
        return safetyService.triggerSos(user, request);
    }

    @PostMapping("/sos/{id}/resolve")
    public SosAlertResponse resolveSos(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return safetyService.resolveSos(user, id);
    }

    @GetMapping("/sos/active")
    @PreAuthorize("hasRole('ADMIN')")
    public List<SosAlertResponse> getActiveSosAlerts() {
        return safetyService.getActiveSosAlerts();
    }
}
