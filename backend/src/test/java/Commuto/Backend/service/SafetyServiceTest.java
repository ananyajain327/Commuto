package Commuto.Backend.service;

import Commuto.Backend.dto.EmergencyContactRequest;
import Commuto.Backend.dto.SafetySummaryResponse;
import Commuto.Backend.dto.SosAlertResponse;
import Commuto.Backend.dto.SosTriggerRequest;
import Commuto.Backend.entity.EmergencyContact;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.SosAlert;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.EmergencyContactRepository;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.RideRequestRepository;
import Commuto.Backend.repository.SosAlertRepository;
import Commuto.Backend.repository.UserPreferenceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SafetyServiceTest {

    @Mock
    private EmergencyContactRepository emergencyContactRepository;

    @Mock
    private SosAlertRepository sosAlertRepository;

    @Mock
    private RideRepository rideRepository;

    @Mock
    private RideRequestRepository rideRequestRepository;

    @Mock
    private UserPreferenceRepository userPreferenceRepository;

    @InjectMocks
    private SafetyService safetyService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(10L);
        testUser.setFullName("Ananya Jain");
        testUser.setEmail("ananya@example.com");
        testUser.setPhone("+919876543210");
        testUser.setRole(User.Role.PASSENGER);
        testUser.setActive(true);
    }

    @Test
    void getSafetySummary_calculatesScoreAndIdentifiesContacts() {
        EmergencyContact contact1 = new EmergencyContact();
        ReflectionTestUtils.setField(contact1, "id", 1L);
        contact1.setUser(testUser);
        contact1.setName("Mom");
        contact1.setPhone("+919876500001");
        contact1.setRelationship("Mother");
        contact1.setPrimary(true);

        EmergencyContact contact2 = new EmergencyContact();
        ReflectionTestUtils.setField(contact2, "id", 2L);
        contact2.setUser(testUser);
        contact2.setName("Dad");
        contact2.setPhone("+919876500002");
        contact2.setRelationship("Father");
        contact2.setPrimary(false);

        when(emergencyContactRepository.findByUserOrderByCreatedAtDesc(testUser))
                .thenReturn(List.of(contact1, contact2));
        when(sosAlertRepository.findByUserAndStatusOrderByCreatedAtDesc(testUser, SosAlert.SosStatus.ACTIVE))
                .thenReturn(List.of());
        when(userPreferenceRepository.existsByUser(testUser)).thenReturn(true);

        SafetySummaryResponse summary = safetyService.getSafetySummary(testUser);

        assertNotNull(summary);
        assertTrue(summary.profileVerified());
        assertTrue(summary.hasPrimaryContact());
        assertTrue(summary.hasPreferencesConfigured());
        assertEquals(2, summary.contactCount());
        // Base 50 + verified 20 + primary 15 + (>=2 contacts) 5 + pref 10 = 100
        assertEquals(100, summary.safetyScore());
        assertEquals(2, summary.contacts().size());
        assertTrue(summary.activeAlerts().isEmpty());
    }

    @Test
    void addEmergencyContact_firstContactBecomesPrimaryAutomatically() {
        when(emergencyContactRepository.countByUser(testUser)).thenReturn(0L);
        when(emergencyContactRepository.save(any(EmergencyContact.class))).thenAnswer(inv -> {
            EmergencyContact c = inv.getArgument(0);
            ReflectionTestUtils.setField(c, "id", 101L);
            return c;
        });

        EmergencyContactRequest request = new EmergencyContactRequest("Sister", "+919876511111", "Sister", false);
        var response = safetyService.addEmergencyContact(testUser, request);

        assertNotNull(response);
        assertEquals(101L, response.id());
        assertEquals("Sister", response.name());
        assertTrue(response.isPrimary());
    }

    @Test
    void addEmergencyContact_unmarksOldPrimaryWhenNewPrimaryAdded() {
        EmergencyContact oldPrimary = new EmergencyContact();
        ReflectionTestUtils.setField(oldPrimary, "id", 1L);
        oldPrimary.setUser(testUser);
        oldPrimary.setName("Brother");
        oldPrimary.setPrimary(true);

        when(emergencyContactRepository.countByUser(testUser)).thenReturn(1L);
        when(emergencyContactRepository.findFirstByUserAndIsPrimaryTrue(testUser)).thenReturn(Optional.of(oldPrimary));
        when(emergencyContactRepository.save(any(EmergencyContact.class))).thenAnswer(inv -> {
            EmergencyContact c = inv.getArgument(0);
            if (c.getId() == null) {
                ReflectionTestUtils.setField(c, "id", 102L);
            }
            return c;
        });

        EmergencyContactRequest request = new EmergencyContactRequest("Mom", "+919876522222", "Mother", true);
        var response = safetyService.addEmergencyContact(testUser, request);

        assertNotNull(response);
        assertTrue(response.isPrimary());
        assertFalse(oldPrimary.isPrimary());
        verify(emergencyContactRepository).save(oldPrimary);
    }

    @Test
    void addEmergencyContact_throwsExceptionWhenMaxLimitReached() {
        when(emergencyContactRepository.countByUser(testUser)).thenReturn(5L);

        EmergencyContactRequest request = new EmergencyContactRequest("Friend", "+919876533333", "Friend", false);
        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> safetyService.addEmergencyContact(testUser, request)
        );

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Maximum of 5"));
    }

    @Test
    void deleteEmergencyContact_promotesNextContactWhenPrimaryDeleted() {
        EmergencyContact primaryContact = new EmergencyContact();
        ReflectionTestUtils.setField(primaryContact, "id", 1L);
        primaryContact.setUser(testUser);
        primaryContact.setName("Primary");
        primaryContact.setPrimary(true);

        EmergencyContact secondContact = new EmergencyContact();
        ReflectionTestUtils.setField(secondContact, "id", 2L);
        secondContact.setUser(testUser);
        secondContact.setName("Secondary");
        secondContact.setPrimary(false);

        when(emergencyContactRepository.findByIdAndUser(1L, testUser)).thenReturn(Optional.of(primaryContact));
        when(emergencyContactRepository.findByUserOrderByCreatedAtDesc(testUser)).thenReturn(List.of(secondContact));

        safetyService.deleteEmergencyContact(testUser, 1L);

        verify(emergencyContactRepository).delete(primaryContact);
        assertTrue(secondContact.isPrimary());
        verify(emergencyContactRepository).save(secondContact);
    }

    @Test
    void triggerSos_createsActiveSosAlert() {
        Ride ride = new Ride();
        ReflectionTestUtils.setField(ride, "id", 55L);
        when(rideRepository.findById(55L)).thenReturn(Optional.of(ride));

        when(sosAlertRepository.save(any(SosAlert.class))).thenAnswer(inv -> {
            SosAlert a = inv.getArgument(0);
            ReflectionTestUtils.setField(a, "id", 999L);
            return a;
        });

        SosTriggerRequest req = new SosTriggerRequest(55L, 26.9124, 75.7873, "Driver took a suspicious detour");
        SosAlertResponse response = safetyService.triggerSos(testUser, req);

        assertNotNull(response);
        assertEquals(999L, response.id());
        assertEquals(55L, response.rideId());
        assertEquals("ACTIVE", response.status());
        assertEquals(26.9124, response.latitude());
        assertEquals(75.7873, response.longitude());
        assertEquals("Driver took a suspicious detour", response.message());
    }

    @Test
    void resolveSos_marksAlertAsResolved() {
        SosAlert activeAlert = new SosAlert();
        ReflectionTestUtils.setField(activeAlert, "id", 888L);
        activeAlert.setUser(testUser);
        activeAlert.setStatus(SosAlert.SosStatus.ACTIVE);

        when(sosAlertRepository.findByIdAndUser(888L, testUser)).thenReturn(Optional.of(activeAlert));
        when(sosAlertRepository.save(any(SosAlert.class))).thenAnswer(inv -> inv.getArgument(0));

        SosAlertResponse response = safetyService.resolveSos(testUser, 888L);

        assertNotNull(response);
        assertEquals("RESOLVED", response.status());
        assertNotNull(activeAlert.getResolvedAt());
    }

    @Test
    void triggerRideSos_createsAlertForAcceptedPassenger() {
        User driver = new User();
        driver.setId(99L);
        driver.setFullName("Rahul Driver");
        driver.setPhone("+919999988888");

        Ride ride = new Ride();
        ReflectionTestUtils.setField(ride, "id", 123L);
        ride.setDriver(driver);
        ride.setStartLocation("Jaipur");
        ride.setDestination("Delhi");
        ride.setVehicleModel("Swift");
        ride.setVehicleNumber("RJ14-AB-1234");

        when(rideRepository.findById(123L)).thenReturn(Optional.of(ride));
        when(rideRequestRepository.existsByRideAndPassengerAndStatus(ride, testUser, Commuto.Backend.entity.RideRequest.RequestStatus.ACCEPTED))
                .thenReturn(true);
        when(sosAlertRepository.save(any(SosAlert.class))).thenAnswer(inv -> {
            SosAlert a = inv.getArgument(0);
            ReflectionTestUtils.setField(a, "id", 777L);
            return a;
        });

        SosTriggerRequest req = new SosTriggerRequest(123L, 26.9, 75.8, "Help needed");
        SosAlertResponse response = safetyService.triggerRideSos(testUser, 123L, req);

        assertNotNull(response);
        assertEquals(777L, response.id());
        assertEquals(123L, response.rideId());
        assertEquals("ACTIVE", response.status());
        assertTrue(response.message().contains("Rahul Driver"));
    }

    @Test
    void triggerRideSos_forbiddenForStranger() {
        User driver = new User();
        driver.setId(99L);

        Ride ride = new Ride();
        ReflectionTestUtils.setField(ride, "id", 123L);
        ride.setDriver(driver);

        when(rideRepository.findById(123L)).thenReturn(Optional.of(ride));
        when(rideRequestRepository.existsByRideAndPassengerAndStatus(ride, testUser, Commuto.Backend.entity.RideRequest.RequestStatus.ACCEPTED))
                .thenReturn(false);

        SosTriggerRequest req = new SosTriggerRequest(123L, 26.9, 75.8, "Help");
        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> safetyService.triggerRideSos(testUser, 123L, req)
        );
        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
    }
}
