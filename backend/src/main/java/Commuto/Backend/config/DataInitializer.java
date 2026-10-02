package Commuto.Backend.config;

import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.RideRepository;
import Commuto.Backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataInitializer(UserRepository userRepository, RideRepository rideRepository) {
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Admin
        User admin = new User();
        admin.setFullName("Platform Admin");
        admin.setEmail("admin@commuto.com");
        admin.setPhone("+919999900001");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        admin.setActive(true);
        admin.setVerified(true);
        userRepository.save(admin);

        // 2. Verified Driver
        User driver = new User();
        driver.setFullName("Rahul Sharma");
        driver.setEmail("driver@commuto.com");
        driver.setPhone("+919999900002");
        driver.setPassword(passwordEncoder.encode("password123"));
        driver.setRole(User.Role.DRIVER);
        driver.setActive(true);
        driver.setVerified(true);
        User savedDriver = userRepository.save(driver);

        // 3. Passenger
        User passenger = new User();
        passenger.setFullName("Priya Patel");
        passenger.setEmail("passenger@commuto.com");
        passenger.setPhone("+919999900003");
        passenger.setPassword(passwordEncoder.encode("password123"));
        passenger.setRole(User.Role.PASSENGER);
        passenger.setActive(true);
        passenger.setVerified(false);
        userRepository.save(passenger);

        // 4. Sample upcoming ride
        Ride sampleRide = new Ride();
        sampleRide.setDriver(savedDriver);
        sampleRide.setStartLocation("Cyber City, Gurugram");
        sampleRide.setDestination("Connaught Place, New Delhi");
        sampleRide.setRideDate(LocalDate.now().plusDays(1));
        sampleRide.setDepartureTime(LocalTime.of(9, 0));
        sampleRide.setAvailableSeats(3);
        sampleRide.setExpectedFare(180.0);
        sampleRide.setVehicleModel("Hyundai Creta");
        sampleRide.setVehicleNumber("DL 09 CC 8899");
        sampleRide.setStatus(Ride.RideStatus.UPCOMING);
        sampleRide.setNotes("Non-smoking, AC available, leaving punctually at 9 AM.");
        rideRepository.save(sampleRide);
    }
}
