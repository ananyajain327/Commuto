package Commuto.Backend.dto;

public class RideBookingRequest {

    private Long rideId;
    private int seatsRequested;
    private String pickupPreference;
    private String note;

    public RideBookingRequest() {
    }

    public RideBookingRequest(Long rideId, int seatsRequested, String pickupPreference, String note) {
        this.rideId = rideId;
        this.seatsRequested = seatsRequested;
        this.pickupPreference = pickupPreference;
        this.note = note;
    }

    public Long getRideId() {
        return rideId;
    }

    public void setRideId(Long rideId) {
        this.rideId = rideId;
    }

    public int getSeatsRequested() {
        return seatsRequested;
    }

    public void setSeatsRequested(int seatsRequested) {
        this.seatsRequested = seatsRequested;
    }

    public String getPickupPreference() {
        return pickupPreference;
    }

    public void setPickupPreference(String pickupPreference) {
        this.pickupPreference = pickupPreference;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}