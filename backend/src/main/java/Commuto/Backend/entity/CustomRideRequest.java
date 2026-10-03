package Commuto.Backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "custom_ride_requests")
public class CustomRideRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "passenger_id", nullable = false)
    private User passenger;

    @Column(nullable = false)
    private String startLocation;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private LocalDate rideDate;

    @Column(nullable = false)
    private LocalTime departureTime;

    @Column(nullable = false)
    private Integer seatsNeeded = 1;

    @Column(nullable = false)
    private Double budgetPerSeat = 0.0;

    @Column(nullable = false)
    private Boolean womenOnly = false;

    @Column(length = 1000)
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.OPEN;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "accepted_driver_id")
    private User acceptedByDriver;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public enum RequestStatus {
        OPEN,
        ACCEPTED,
        CANCELLED,
        COMPLETED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (seatsNeeded == null || seatsNeeded <= 0) seatsNeeded = 1;
        if (budgetPerSeat == null) budgetPerSeat = 0.0;
        if (womenOnly == null) womenOnly = false;
        if (status == null) status = RequestStatus.OPEN;
    }

    public CustomRideRequest() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getPassenger() {
        return passenger;
    }

    public void setPassenger(User passenger) {
        this.passenger = passenger;
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

    public Integer getSeatsNeeded() {
        return seatsNeeded;
    }

    public void setSeatsNeeded(Integer seatsNeeded) {
        this.seatsNeeded = seatsNeeded;
    }

    public Double getBudgetPerSeat() {
        return budgetPerSeat;
    }

    public void setBudgetPerSeat(Double budgetPerSeat) {
        this.budgetPerSeat = budgetPerSeat;
    }

    public Boolean getWomenOnly() {
        return womenOnly;
    }

    public void setWomenOnly(Boolean womenOnly) {
        this.womenOnly = womenOnly;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public User getAcceptedByDriver() {
        return acceptedByDriver;
    }

    public void setAcceptedByDriver(User acceptedByDriver) {
        this.acceptedByDriver = acceptedByDriver;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
