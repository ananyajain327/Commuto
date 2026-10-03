package Commuto.Backend.service;

import Commuto.Backend.dto.AdminOverviewResponse;
import Commuto.Backend.dto.RideResponse;
import Commuto.Backend.dto.UserResponse;
import Commuto.Backend.entity.DriverVerification;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.SosAlert;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.DriverVerificationRepository;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.SosAlertRepository;
import Commuto.Backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final DriverVerificationRepository driverVerificationRepository;
    private final SosAlertRepository sosAlertRepository;

    public AdminService(
            UserRepository userRepository,
            RideRepository rideRepository,
            DriverVerificationRepository driverVerificationRepository,
            SosAlertRepository sosAlertRepository) {
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
        this.driverVerificationRepository = driverVerificationRepository;
        this.sosAlertRepository = sosAlertRepository;
    }

    @Transactional(readOnly = true)
    public AdminOverviewResponse getOverview() {
        long totalUsers = userRepository.count();
        long totalDrivers = userRepository.countByRole(User.Role.DRIVER);
        long verifiedDrivers = userRepository.countByRoleAndVerifiedTrue(User.Role.DRIVER);

        long activeRides = rideRepository.countByStatus(Ride.RideStatus.ACTIVE);
        long completedRides = rideRepository.countByStatus(Ride.RideStatus.COMPLETED);
        long totalRides = rideRepository.count();

        long pendingVerifications = driverVerificationRepository.countByStatus(DriverVerification.VerificationStatus.PENDING);
        long activeSosAlerts = sosAlertRepository.findByStatusOrderByCreatedAtDesc(SosAlert.SosStatus.ACTIVE).size();

        List<Ride> allRides = rideRepository.findAll();
        double platformGrossFare = allRides.stream()
                .filter(r -> r.getStatus() == Ride.RideStatus.COMPLETED)
                .mapToDouble(Ride::getExpectedFare)
                .sum();

        return new AdminOverviewResponse(
                totalUsers,
                totalDrivers,
                verifiedDrivers,
                activeRides,
                completedRides,
                totalRides,
                pendingVerifications,
                activeSosAlerts,
                platformGrossFare
        );
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RideResponse> getAllRides() {
        return rideRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(RideResponse::new)
                .toList();
    }

    @Transactional
    public UserResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        user.setActive(!user.isActive());
        return new UserResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<Commuto.Backend.dto.SosAlertResponse> getSosAlerts() {
        return sosAlertRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(Commuto.Backend.dto.SosAlertResponse::new)
                .toList();
    }

    @Transactional
    public Commuto.Backend.dto.SosAlertResponse resolveSosAlert(Long alertId) {
        SosAlert alert = sosAlertRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found with id: " + alertId));
        alert.setStatus(SosAlert.SosStatus.RESOLVED);
        alert.setResolvedAt(java.time.LocalDateTime.now());
        return new Commuto.Backend.dto.SosAlertResponse(sosAlertRepository.save(alert));
    }
}
