package Commuto.Backend.controller;

import Commuto.Backend.dto.PreferenceRequest;
import Commuto.Backend.dto.PreferenceResponse;
import Commuto.Backend.entity.User;
import Commuto.Backend.entity.UserPreference;
import Commuto.Backend.service.UserPreferenceService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/preferences")
public class UserPreferenceController {

    private final UserPreferenceService preferenceService;

    public UserPreferenceController(
            UserPreferenceService preferenceService) {

        this.preferenceService = preferenceService;
    }

    // =========================
    // GET PREFERENCES
    // =========================

    @GetMapping
    public PreferenceResponse getPreferences(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        UserPreference preference =
                preferenceService.getPreferences(user);

        return new PreferenceResponse(preference);
    }

    // =========================
    // UPDATE PREFERENCES
    // =========================

    @PutMapping
    public PreferenceResponse updatePreferences(
            Authentication authentication,
            @Valid @RequestBody PreferenceRequest request) {

        User user = (User) authentication.getPrincipal();

        UserPreference updatedPreference =
                preferenceService.updatePreferences(
                        user,
                        request
                );

        return new PreferenceResponse(updatedPreference);
    }
}