package Commuto.Backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class CreateRideRequest {

    @NotBlank(message = "Start location is required")
    private String startLocation;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Ride date is required")
    @FutureOrPresent(message = "Ride date must be today or in the future")
    private LocalDate rideDate;

    @NotNull(message = "Departure time is required")
    private LocalTime departureTime;

    @Min(value = 1, message = "At least 1 seat must be available")
    @Max(value = 6, message = "Maximum 6 seats are allowed")
    private int availableSeats;

    @DecimalMin(value = "1.0", message = "Expected fare must be greater than 0")
    private double expectedFare;

    @NotBlank(message = "Vehicle model is required")
    private String vehicleModel;

    @NotBlank(message = "Vehicle number is required")
    private String vehicleNumber;

    private boolean womenOnly;

    private String notes;

    public CreateRideRequest() {
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

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public double getExpectedFare() {
        return expectedFare;
    }

    public void setExpectedFare(double expectedFare) {
        this.expectedFare = expectedFare;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public boolean isWomenOnly() {
        return womenOnly;
    }

    public void setWomenOnly(boolean womenOnly) {
        this.womenOnly = womenOnly;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}