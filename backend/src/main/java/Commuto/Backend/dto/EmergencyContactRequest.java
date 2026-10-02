package Commuto.Backend.dto;

import jakarta.validation.constraints.NotBlank;

public class EmergencyContactRequest {

    @NotBlank(message = "Contact name is required")
    private String name;

    @NotBlank(message = "Contact phone is required")
    private String phone;

    @NotBlank(message = "Relationship is required")
    private String relationship;

    private boolean isPrimary;

    public EmergencyContactRequest() {
    }

    public EmergencyContactRequest(String name, String phone, String relationship, boolean isPrimary) {
        this.name = name;
        this.phone = phone;
        this.relationship = relationship;
        this.isPrimary = isPrimary;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public boolean isPrimary() {
        return isPrimary;
    }

    public void setPrimary(boolean primary) {
        isPrimary = primary;
    }
}
