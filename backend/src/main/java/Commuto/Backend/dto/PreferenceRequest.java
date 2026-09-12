package Commuto.Backend.dto;

public class PreferenceRequest {

    private boolean womenOnly;
    private boolean rideNotifications;
    private boolean safetyNotifications;
    private boolean promotionalNotifications;

    public PreferenceRequest() {
    }

    public boolean isWomenOnly() {
        return womenOnly;
    }

    public void setWomenOnly(boolean womenOnly) {
        this.womenOnly = womenOnly;
    }

    public boolean isRideNotifications() {
        return rideNotifications;
    }

    public void setRideNotifications(boolean rideNotifications) {
        this.rideNotifications = rideNotifications;
    }

    public boolean isSafetyNotifications() {
        return safetyNotifications;
    }

    public void setSafetyNotifications(boolean safetyNotifications) {
        this.safetyNotifications = safetyNotifications;
    }

    public boolean isPromotionalNotifications() {
        return promotionalNotifications;
    }

    public void setPromotionalNotifications(
            boolean promotionalNotifications) {

        this.promotionalNotifications = promotionalNotifications;
    }
}