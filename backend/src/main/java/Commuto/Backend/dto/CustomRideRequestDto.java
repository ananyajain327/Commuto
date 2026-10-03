package Commuto.Backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class CustomRideRequestDto {
    private String startLocation;
    private String destination;
    private LocalDate rideDate;
    private LocalTime departureTime;
    private Integer seatsNeeded;
    private Double budgetPerSeat;
    private Boolean womenOnly;
    private String note;

    public CustomRideRequestDto() {
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
}
