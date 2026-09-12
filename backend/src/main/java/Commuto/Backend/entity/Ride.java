package Commuto.Backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "rides")
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Driver who is offering the ride
    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @Column(nullable = false)
    private String startLocation;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private LocalDate rideDate;

    @Column(nullable = false)
    private LocalTime departureTime;

    @Column(nullable = false)
    private int availableSeats;

    @Column(nullable = false)
    private double expectedFare;

    @Column(nullable = false)
    private String vehicleModel;

    @Column(nullable = false)
    private String vehicleNumber;

    @Column(nullable = false)
    private boolean womenOnly = false;

    @Column(length = 500)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RideStatus status = RideStatus.UPCOMING;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public enum RideStatus {
        UPCOMING,
        ACTIVE,
        COMPLETED,
        CANCELLED
    }

    public Ride() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getDriver() {
        return driver;
    }

    public void setDriver(User driver) {
        this.driver = driver;
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

    public RideStatus getStatus() {
        return status;
    }

    public void setStatus(RideStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}