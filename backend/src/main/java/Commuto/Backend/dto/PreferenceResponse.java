package Commuto.Backend.dto;

import Commuto.Backend.entity.UserPreference;

public class PreferenceResponse {

    private boolean womenOnly;
    private boolean rideNotifications;
    private boolean safetyNotifications;
    private boolean promotionalNotifications;

    public PreferenceResponse(UserPreference preference) {

        this.womenOnly = preference.isWomenOnly();
        this.rideNotifications = preference.isRideNotifications();
        this.safetyNotifications = preference.isSafetyNotifications();
        this.promotionalNotifications =
                preference.isPromotionalNotifications();
    }

    public boolean isWomenOnly() {
        return womenOnly;
    }

    public boolean isRideNotifications() {
        return rideNotifications;
    }

    public boolean isSafetyNotifications() {
        return safetyNotifications;
    }

    public boolean isPromotionalNotifications() {
        return promotionalNotifications;
    }
}