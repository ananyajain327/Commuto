package Commuto.Backend.dto;

import Commuto.Backend.entity.DriverVerification;
import jakarta.validation.constraints.NotNull;

public class VerificationReviewRequest {

    @NotNull(message = "Review status is required")
    private DriverVerification.VerificationStatus status;

    private String rejectionReason;

    public VerificationReviewRequest() {
    }

    public VerificationReviewRequest(DriverVerification.VerificationStatus status, String rejectionReason) {
        this.status = status;
        this.rejectionReason = rejectionReason;
    }

    public DriverVerification.VerificationStatus getStatus() {
        return status;
    }

    public void setStatus(DriverVerification.VerificationStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
