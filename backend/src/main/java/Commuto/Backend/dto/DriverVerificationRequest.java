package Commuto.Backend.dto;

import jakarta.validation.constraints.NotBlank;

public class DriverVerificationRequest {

    @NotBlank(message = "Driving license number is required")
    private String licenseNumber;

    @NotBlank(message = "Vehicle RC number is required")
    private String vehicleRc;

    @NotBlank(message = "Insurance policy number is required")
    private String insuranceNumber;

    @NotBlank(message = "Vehicle model is required")
    private String vehicleModel;

    @NotBlank(message = "Vehicle license plate number is required")
    private String vehicleNumber;

    public DriverVerificationRequest() {
    }

    public DriverVerificationRequest(String licenseNumber, String vehicleRc, String insuranceNumber, String vehicleModel, String vehicleNumber) {
        this.licenseNumber = licenseNumber;
        this.vehicleRc = vehicleRc;
        this.insuranceNumber = insuranceNumber;
        this.vehicleModel = vehicleModel;
        this.vehicleNumber = vehicleNumber;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getVehicleRc() {
        return vehicleRc;
    }

    public void setVehicleRc(String vehicleRc) {
        this.vehicleRc = vehicleRc;
    }

    public String getInsuranceNumber() {
        return insuranceNumber;
    }

    public void setInsuranceNumber(String insuranceNumber) {
        this.insuranceNumber = insuranceNumber;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }
}
