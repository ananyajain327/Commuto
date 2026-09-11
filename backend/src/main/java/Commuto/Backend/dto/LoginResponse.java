package Commuto.Backend.dto;

import Commuto.Backend.entity.User;

public class LoginResponse {

    private String token;
    private Long userId;
    private String fullName;
    private String email;
    private String role;

    public LoginResponse(
            String token,
            User user
    ) {
        this.token = token;
        this.userId = user.getId();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.role = user.getRole().name();
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}