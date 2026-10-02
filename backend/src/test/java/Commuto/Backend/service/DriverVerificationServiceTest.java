package Commuto.Backend.service;

import Commuto.Backend.dto.DriverVerificationRequest;
import Commuto.Backend.dto.DriverVerificationResponse;
import Commuto.Backend.dto.VerificationReviewRequest;
import Commuto.Backend.entity.DriverVerification;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.DriverVerificationRepository;
import Commuto.Backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DriverVerificationServiceTest {

    @Mock
    private DriverVerificationRepository driverVerificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DriverVerificationService driverVerificationService;

    private User driver;
    private User admin;

    @BeforeEach
    void setUp() {
        driver = new User();
        driver.setId(20L);
        driver.setFullName("Rohan Verma");
        driver.setEmail("rohan@example.com");
        driver.setRole(User.Role.DRIVER);
        driver.setVerified(false);

        admin = new User();
        admin.setId(1L);
        admin.setFullName("Platform Admin");
        admin.setRole(User.Role.ADMIN);
    }

    @Test
    void submitVerification_createsPendingApplication() {
        DriverVerificationRequest req = new DriverVerificationRequest(
                "DL-RJ-2024-9988",
                "RC-RJ-14-AX-5555",
                "INS-998877",
                "Swift Dzire",
                "RJ 14 AX 5555"
        );

        when(driverVerificationRepository.findByDriver(driver)).thenReturn(Optional.empty());
        when(driverVerificationRepository.save(any(DriverVerification.class))).thenAnswer(inv -> {
            DriverVerification v = inv.getArgument(0);
            ReflectionTestUtils.setField(v, "id", 100L);
            return v;
        });

        DriverVerificationResponse response = driverVerificationService.submitVerification(driver, req);

        assertNotNull(response);
        assertEquals(100L, response.id());
        assertEquals("PENDING", response.status());
        assertEquals("DL-RJ-2024-9988", response.licenseNumber());
        assertEquals("Swift Dzire", response.vehicleModel());
    }

    @Test
    void submitVerification_failsForNonDriver() {
        User passenger = new User();
        passenger.setId(30L);
        passenger.setRole(User.Role.PASSENGER);

        DriverVerificationRequest req = new DriverVerificationRequest("DL", "RC", "INS", "Car", "123");

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> driverVerificationService.submitVerification(passenger, req)
        );

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
    }

    @Test
    void reviewVerification_approvedSetsDriverVerified() {
        DriverVerification verification = new DriverVerification();
        ReflectionTestUtils.setField(verification, "id", 200L);
        verification.setDriver(driver);
        verification.setStatus(DriverVerification.VerificationStatus.PENDING);

        when(driverVerificationRepository.findById(200L)).thenReturn(Optional.of(verification));
        when(driverVerificationRepository.save(any(DriverVerification.class))).thenAnswer(inv -> inv.getArgument(0));

        VerificationReviewRequest reviewReq = new VerificationReviewRequest(
                DriverVerification.VerificationStatus.APPROVED,
                null
        );

        DriverVerificationResponse res = driverVerificationService.reviewVerification(200L, admin, reviewReq);

        assertNotNull(res);
        assertEquals("APPROVED", res.status());
        assertTrue(driver.isVerified());
        verify(userRepository).save(driver);
    }

    @Test
    void reviewVerification_rejectedLeavesDriverUnverifiedWithReason() {
        DriverVerification verification = new DriverVerification();
        ReflectionTestUtils.setField(verification, "id", 201L);
        verification.setDriver(driver);
        verification.setStatus(DriverVerification.VerificationStatus.PENDING);

        when(driverVerificationRepository.findById(201L)).thenReturn(Optional.of(verification));
        when(driverVerificationRepository.save(any(DriverVerification.class))).thenAnswer(inv -> inv.getArgument(0));

        VerificationReviewRequest reviewReq = new VerificationReviewRequest(
                DriverVerification.VerificationStatus.REJECTED,
                "License photo was blurry"
        );

        DriverVerificationResponse res = driverVerificationService.reviewVerification(201L, admin, reviewReq);

        assertNotNull(res);
        assertEquals("REJECTED", res.status());
        assertEquals("License photo was blurry", res.rejectionReason());
        assertFalse(driver.isVerified());
        verify(userRepository).save(driver);
    }
}
