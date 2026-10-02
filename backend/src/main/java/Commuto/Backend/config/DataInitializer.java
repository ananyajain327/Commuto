package Commuto.Backend.config;

import Commuto.Backend.entity.EmergencyContact;
import Commuto.Backend.entity.Ride;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.EmergencyContactRepository;
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
    private final EmergencyContactRepository emergencyContactRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataInitializer(
            UserRepository userRepository,
            RideRepository rideRepository,
            EmergencyContactRepository emergencyContactRepository) {
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
        this.emergencyContactRepository = emergencyContactRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
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
            User savedPassenger = userRepository.save(passenger);

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

            // 5. Emergency Contacts for Passenger
            EmergencyContact pContact1 = new EmergencyContact();
            pContact1.setUser(savedPassenger);
            pContact1.setName("Ramesh Patel");
            pContact1.setPhone("+919876543210");
            pContact1.setRelationship("Father");
            pContact1.setPrimary(true);
            emergencyContactRepository.save(pContact1);

            EmergencyContact pContact2 = new EmergencyContact();
            pContact2.setUser(savedPassenger);
            pContact2.setName("Sunita Patel");
            pContact2.setPhone("+919876543211");
            pContact2.setRelationship("Mother");
            pContact2.setPrimary(false);
            emergencyContactRepository.save(pContact2);

            // 6. Emergency Contacts for Driver
            EmergencyContact dContact1 = new EmergencyContact();
            dContact1.setUser(savedDriver);
            dContact1.setName("Kavita Sharma");
            dContact1.setPhone("+919876512345");
            dContact1.setRelationship("Spouse");
            dContact1.setPrimary(true);
            emergencyContactRepository.save(dContact1);
        } else {
            // Seed emergency contacts if existing user has none
            userRepository.findByEmail("passenger@commuto.com").ifPresent(p -> {
                if (emergencyContactRepository.countByUser(p) == 0) {
                    EmergencyContact c1 = new EmergencyContact();
                    c1.setUser(p);
                    c1.setName("Ramesh Patel");
                    c1.setPhone("+919876543210");
                    c1.setRelationship("Father");
                    c1.setPrimary(true);
                    emergencyContactRepository.save(c1);

                    EmergencyContact c2 = new EmergencyContact();
                    c2.setUser(p);
                    c2.setName("Sunita Patel");
                    c2.setPhone("+919876543211");
                    c2.setRelationship("Mother");
                    c2.setPrimary(false);
                    emergencyContactRepository.save(c2);
                }
            });

            userRepository.findByEmail("driver@commuto.com").ifPresent(d -> {
                if (emergencyContactRepository.countByUser(d) == 0) {
                    EmergencyContact d1 = new EmergencyContact();
                    d1.setUser(d);
                    d1.setName("Kavita Sharma");
                    d1.setPhone("+919876512345");
                    d1.setRelationship("Spouse");
                    d1.setPrimary(true);
                    emergencyContactRepository.save(d1);
                }
            });
        }
    }
}
