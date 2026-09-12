package Commuto.Backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class SearchRideRequest {

    @NotBlank(message = "Start location is required")
    private String startLocation;

    @NotBlank(message = "Destination is required")
    private String destination;

    private LocalDate rideDate;

    public SearchRideRequest() {
    }

    public String getStartLocation() {
        return startLocation;
    }

    public void setStartLocation(String startLocation) {
        this.startLocation = startLocation;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDate getRideDate() {
        return rideDate;
    }

    public void setRideDate(LocalDate rideDate) {
        this.rideDate = rideDate;
    }
}