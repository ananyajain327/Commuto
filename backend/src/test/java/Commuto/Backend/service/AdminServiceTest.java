package Commuto.Backend.service;

import Commuto.Backend.dto.AdminOverviewResponse;
import Commuto.Backend.entity.DriverVerification;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.SosAlert;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.DriverVerificationRepository;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.SosAlertRepository;
import Commuto.Backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RideRepository rideRepository;

    @Mock
    private DriverVerificationRepository driverVerificationRepository;

    @Mock
    private SosAlertRepository sosAlertRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    void getOverview_aggregatesPlatformStatistics() {
        when(userRepository.count()).thenReturn(150L);
        when(userRepository.countByRole(User.Role.DRIVER)).thenReturn(40L);
        when(userRepository.countByRoleAndVerifiedTrue(User.Role.DRIVER)).thenReturn(25L);

        when(rideRepository.countByStatus(Ride.RideStatus.ACTIVE)).thenReturn(8L);
        when(rideRepository.countByStatus(Ride.RideStatus.COMPLETED)).thenReturn(60L);
        when(rideRepository.count()).thenReturn(75L);

        Ride completedRide1 = new Ride();
        ReflectionTestUtils.setField(completedRide1, "id", 1L);
        completedRide1.setStatus(Ride.RideStatus.COMPLETED);
        completedRide1.setExpectedFare(250.0);

        Ride completedRide2 = new Ride();
        ReflectionTestUtils.setField(completedRide2, "id", 2L);
        completedRide2.setStatus(Ride.RideStatus.COMPLETED);
        completedRide2.setExpectedFare(350.0);

        when(rideRepository.findAll()).thenReturn(List.of(completedRide1, completedRide2));
        when(driverVerificationRepository.countByStatus(DriverVerification.VerificationStatus.PENDING)).thenReturn(5L);

        SosAlert activeAlert = new SosAlert();
        activeAlert.setStatus(SosAlert.SosStatus.ACTIVE);
        when(sosAlertRepository.findByStatusOrderByCreatedAtDesc(SosAlert.SosStatus.ACTIVE)).thenReturn(List.of(activeAlert));

        AdminOverviewResponse overview = adminService.getOverview();

        assertNotNull(overview);
        assertEquals(150L, overview.totalUsers());
        assertEquals(40L, overview.totalDrivers());
        assertEquals(25L, overview.verifiedDrivers());
        assertEquals(8L, overview.activeRides());
        assertEquals(60L, overview.completedRides());
        assertEquals(75L, overview.totalRides());
        assertEquals(5L, overview.pendingVerifications());
        assertEquals(1L, overview.activeSosAlerts());
        assertEquals(600.0, overview.platformGrossFare());
    }
}
