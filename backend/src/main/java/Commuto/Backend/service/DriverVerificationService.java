package Commuto.Backend.service;

import Commuto.Backend.dto.DriverVerificationRequest;
import Commuto.Backend.dto.DriverVerificationResponse;
import Commuto.Backend.dto.VerificationReviewRequest;
import Commuto.Backend.entity.DriverVerification;
import Commuto.Backend.entity.User;
import Commuto.Backend.repository.DriverVerificationRepository;
import Commuto.Backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DriverVerificationService {

    private final DriverVerificationRepository driverVerificationRepository;
    private final UserRepository userRepository;

    public DriverVerificationService(
            DriverVerificationRepository driverVerificationRepository,
            UserRepository userRepository) {
        this.driverVerificationRepository = driverVerificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public DriverVerificationResponse submitVerification(User driver, DriverVerificationRequest request) {
        if (driver.getRole() != User.Role.DRIVER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only driver accounts can submit driver verifications");
        }

        DriverVerification verification = driverVerificationRepository.findByDriver(driver)
                .orElseGet(() -> {
                    DriverVerification v = new DriverVerification();
                    v.setDriver(driver);
                    return v;
                });

        if (verification.getStatus() == DriverVerification.VerificationStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Driver is already verified");
        }

        verification.setLicenseNumber(request.getLicenseNumber().trim());
        verification.setVehicleRc(request.getVehicleRc().trim());
        verification.setInsuranceNumber(request.getInsuranceNumber().trim());
        verification.setVehicleModel(request.getVehicleModel().trim());
        verification.setVehicleNumber(request.getVehicleNumber().trim());
        verification.setStatus(DriverVerification.VerificationStatus.PENDING);
        verification.setRejectionReason(null);
        verification.setSubmittedAt(LocalDateTime.now());
        verification.setReviewedAt(null);
        verification.setReviewedBy(null);

        return new DriverVerificationResponse(driverVerificationRepository.save(verification));
    }

    @Transactional(readOnly = true)
    public DriverVerificationResponse getMyVerification(User driver) {
        return driverVerificationRepository.findByDriver(driver)
                .map(DriverVerificationResponse::new)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<DriverVerificationResponse> getPendingVerifications() {
        return driverVerificationRepository.findByStatusOrderBySubmittedAtAsc(DriverVerification.VerificationStatus.PENDING).stream()
                .map(DriverVerificationResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DriverVerificationResponse> getAllVerifications() {
        return driverVerificationRepository.findAllByOrderBySubmittedAtDesc().stream()
                .map(DriverVerificationResponse::new)
                .toList();
    }

    @Transactional
    public DriverVerificationResponse reviewVerification(Long verificationId, User admin, VerificationReviewRequest request) {
        DriverVerification verification = driverVerificationRepository.findById(verificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Verification application not found"));

        verification.setStatus(request.getStatus());
        verification.setReviewedAt(LocalDateTime.now());
        verification.setReviewedBy(admin);

        User driver = verification.getDriver();
        if (request.getStatus() == DriverVerification.VerificationStatus.APPROVED) {
            verification.setRejectionReason(null);
            driver.setVerified(true);
        } else {
            String reason = request.getRejectionReason() != null && !request.getRejectionReason().isBlank()
                    ? request.getRejectionReason().trim()
                    : "Submitted documents do not meet verification criteria";
            verification.setRejectionReason(reason);
            driver.setVerified(false);
        }

        userRepository.save(driver);
        return new DriverVerificationResponse(driverVerificationRepository.save(verification));
    }
}
