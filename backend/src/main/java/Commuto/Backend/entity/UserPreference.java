package Commuto.Backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_preferences")
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private boolean womenOnly = false;

    @Column(nullable = false)
    private boolean rideNotifications = true;

    @Column(nullable = false)
    private boolean safetyNotifications = true;

    @Column(nullable = false)
    private boolean promotionalNotifications = false;

    public UserPreference() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public void setPromotionalNotifications(boolean promotionalNotifications) {
        this.promotionalNotifications = promotionalNotifications;
    }
}