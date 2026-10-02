package Commuto.Backend.dto;

import Commuto.Backend.entity.DriverVerification;

import java.time.LocalDateTime;

public record DriverVerificationResponse(
        Long id,
        Long driverId,
        String driverName,
        String driverEmail,
        String licenseNumber,
        String vehicleRc,
        String insuranceNumber,
        String vehicleModel,
        String vehicleNumber,
        String status,
        String rejectionReason,
        LocalDateTime submittedAt,
        LocalDateTime reviewedAt
) {
    public DriverVerificationResponse(DriverVerification v) {
        this(
                v.getId(),
                v.getDriver().getId(),
                v.getDriver().getFullName(),
                v.getDriver().getEmail(),
                v.getLicenseNumber(),
                v.getVehicleRc(),
                v.getInsuranceNumber(),
                v.getVehicleModel(),
                v.getVehicleNumber(),
                v.getStatus().name(),
                v.getRejectionReason(),
                v.getSubmittedAt(),
                v.getReviewedAt()
        );
    }
}
