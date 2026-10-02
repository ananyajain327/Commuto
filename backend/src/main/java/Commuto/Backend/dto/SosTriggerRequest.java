package Commuto.Backend.dto;

public class SosTriggerRequest {

    private Long rideId;
    private Double latitude;
    private Double longitude;
    private String message;

    public SosTriggerRequest() {
    }

    public SosTriggerRequest(Long rideId, Double latitude, Double longitude, String message) {
        this.rideId = rideId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.message = message;
    }

    public Long getRideId() {
        return rideId;
    }

    public void setRideId(Long rideId) {
        this.rideId = rideId;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
