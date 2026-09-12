package Commuto.Backend.dto;

import Commuto.Backend.entity.Ride;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class RideResponse {

    private Long id;

    private Long driverId;
    private String driverName;

    private String startLocation;
    private String destination;

    private LocalDate rideDate;
    private LocalTime departureTime;

    private int availableSeats;
    private double expectedFare;

    private String vehicleModel;
    private String vehicleNumber;

    private boolean womenOnly;
    private String notes;

    private String status;
    private LocalDateTime createdAt;

    public RideResponse(Ride ride) {

        this.id = ride.getId();

        this.driverId = ride.getDriver().getId();
        this.driverName = ride.getDriver().getFullName();

        this.startLocation = ride.getStartLocation();
        this.destination = ride.getDestination();

        this.rideDate = ride.getRideDate();
        this.departureTime = ride.getDepartureTime();

        this.availableSeats = ride.getAvailableSeats();
        this.expectedFare = ride.getExpectedFare();

        this.vehicleModel = ride.getVehicleModel();
        this.vehicleNumber = ride.getVehicleNumber();

        this.womenOnly = ride.isWomenOnly();
        this.notes = ride.getNotes();

        this.status = ride.getStatus().name();
        this.createdAt = ride.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public Long getDriverId() {
        return driverId;
    }

    public String getDriverName() {
        return driverName;
    }

    public String getStartLocation() {
        return startLocation;
    }

    public String getDestination() {
        return destination;
    }

    public LocalDate getRideDate() {
        return rideDate;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public double getExpectedFare() {
        return expectedFare;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public boolean isWomenOnly() {
        return womenOnly;
    }

    public String getNotes() {
        return notes;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}