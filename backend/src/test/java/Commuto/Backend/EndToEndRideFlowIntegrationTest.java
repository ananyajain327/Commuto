package Commuto.Backend;

import Commuto.Backend.dto.CreateRideRequest;
import Commuto.Backend.dto.RatingResponse;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.RideRequest;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RatingRepository;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.RideRequestRepository;
import Commuto.Backend.repository.UserRepository;
import Commuto.Backend.service.RatingService;
import Commuto.Backend.service.RideRequestService;
import Commuto.Backend.service.RideService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class EndToEndRideFlowIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private RideRequestRepository rideRequestRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private RideService rideService;

    @Autowired
    private RideRequestService rideRequestService;

    @Autowired
    private RatingService ratingService;

    private User driver;
    private User passenger;

    @BeforeEach
    void setUp() {
        driver = new User();
        driver.setFullName("Verified Driver");
        driver.setEmail("driver.e2e@commuto.com");
        driver.setPhone("+919876543210");
        driver.setPassword("securePassword123");
        driver.setRole(User.Role.DRIVER);
        driver.setActive(true);
        driver.setVerified(true);
        driver = userRepository.save(driver);

        passenger = new User();
        passenger.setFullName("Test Passenger");
        passenger.setEmail("passenger.e2e@commuto.com");
        passenger.setPhone("+919876543211");
        passenger.setPassword("securePassword123");
        passenger.setRole(User.Role.PASSENGER);
        passenger.setActive(true);
        passenger.setVerified(false);
        passenger = userRepository.save(passenger);
    }

    @Test
    @DisplayName("Complete Ride Lifecycle: Publish -> Request -> Accept -> Start -> Complete -> Bidirectional Rating")
    void testFullRideLifecycleAndBidirectionalRating() {
        // Step 1: Verified driver publishes ride
        CreateRideRequest rideReq = new CreateRideRequest();
        rideReq.setStartLocation("Cyber City");
        rideReq.setDestination("Sector 29");
        rideReq.setRideDate(LocalDate.now().plusDays(1));
        rideReq.setDepartureTime(LocalTime.of(9, 30));
        rideReq.setAvailableSeats(3);
        rideReq.setExpectedFare(150.0);
        rideReq.setVehicleModel("Honda City");
        rideReq.setVehicleNumber("DL 01 AB 1234");
        rideReq.setWomenOnly(false);
        rideReq.setNotes("Leaving on time");

        Ride publishedRide = rideService.createRide(driver, rideReq);
        assertNotNull(publishedRide.getId(), "Published ride should have persisted ID");
        assertEquals(Ride.RideStatus.UPCOMING, publishedRide.getStatus());
        assertEquals(3, publishedRide.getAvailableSeats());

        // Step 2: Passenger requests a seat
        RideRequest bookingRequest = rideRequestService.createRequest(
                passenger,
                publishedRide.getId(),
                1,
                "Cyber City Gate 2",
                "Have a small handbag"
        );
        assertNotNull(bookingRequest.getId(), "Ride request should have persisted ID");
        assertEquals(RideRequest.RequestStatus.PENDING, bookingRequest.getStatus());
        assertEquals(1, bookingRequest.getSeatsRequested());

        // Step 3: Driver accepts passenger request
        RideRequest acceptedRequest = rideRequestService.acceptRequest(bookingRequest.getId(), driver);
        assertEquals(RideRequest.RequestStatus.ACCEPTED, acceptedRequest.getStatus());

        Ride rideAfterAccept = rideRepository.findById(publishedRide.getId()).orElseThrow();
        assertEquals(2, rideAfterAccept.getAvailableSeats(), "Available seats should decrement from 3 to 2");

        // Step 4: Driver starts the ride
        Ride startedRide = rideService.startRide(publishedRide.getId(), driver);
        assertEquals(Ride.RideStatus.ACTIVE, startedRide.getStatus(), "Ride status should transition to ACTIVE");

        // Step 5: Driver completes the ride
        Ride completedRide = rideService.completeRide(publishedRide.getId(), driver);
        assertEquals(Ride.RideStatus.COMPLETED, completedRide.getStatus(), "Ride status should transition to COMPLETED");

        // Step 6: Passenger rates driver
        RatingResponse passengerRating = ratingService.submitRating(
                passenger,
                acceptedRequest.getId(),
                5,
                "Smooth driving, very polite!"
        );
        assertEquals(5, passengerRating.score());
        assertEquals(5.0, passengerRating.updatedAverageScore());
        assertEquals(1, ratingService.getRatingCount(driver));
        assertEquals(5.0, ratingService.getAverageRating(driver));

        // Step 7: Driver rates passenger back
        RatingResponse driverRating = ratingService.submitRating(
                driver,
                acceptedRequest.getId(),
                5,
                "Great passenger, on time at pickup."
        );
        assertEquals(5, driverRating.score());
        assertEquals(5.0, driverRating.updatedAverageScore());
        assertEquals(1, ratingService.getRatingCount(passenger));
        assertEquals(5.0, ratingService.getAverageRating(passenger));
    }
}
