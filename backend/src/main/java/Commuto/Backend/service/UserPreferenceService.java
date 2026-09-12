package Commuto.Backend.service;

import Commuto.Backend.dto.PreferenceRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.entity.UserPreference;
import Commuto.Backend.repository.UserPreferenceRepository;
import org.springframework.stereotype.Service;

@Service
public class UserPreferenceService {

    private final UserPreferenceRepository preferenceRepository;

    public UserPreferenceService(
            UserPreferenceRepository preferenceRepository) {

        this.preferenceRepository = preferenceRepository;
    }

    // =========================
    // GET PREFERENCES
    // =========================

    public UserPreference getPreferences(User user) {

        return preferenceRepository
                .findByUser(user)
                .orElseGet(() -> createDefaultPreferences(user));
    }

    // =========================
    // UPDATE PREFERENCES
    // =========================

    public UserPreference updatePreferences(
            User user,
            PreferenceRequest request) {

        UserPreference preference =
                preferenceRepository
                        .findByUser(user)
                        .orElseGet(() ->
                                createDefaultPreferences(user));

        preference.setWomenOnly(request.isWomenOnly());
        preference.setRideNotifications(
                request.isRideNotifications());
        preference.setSafetyNotifications(
                request.isSafetyNotifications());
        preference.setPromotionalNotifications(
                request.isPromotionalNotifications());

        return preferenceRepository.save(preference);
    }

    // =========================
    // DEFAULT PREFERENCES
    // =========================

    private UserPreference createDefaultPreferences(
            User user) {

        UserPreference preference = new UserPreference();

        preference.setUser(user);
        preference.setWomenOnly(false);
        preference.setRideNotifications(true);
        preference.setSafetyNotifications(true);
        preference.setPromotionalNotifications(false);

        return preferenceRepository.save(preference);
    }
}