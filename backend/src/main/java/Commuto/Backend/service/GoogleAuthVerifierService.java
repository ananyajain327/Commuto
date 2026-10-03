package Commuto.Backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GoogleAuthVerifierService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String expectedClientId;

    public GoogleAuthVerifierService(
            @Value("${app.google.client-id:}") String expectedClientId) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.expectedClientId = expectedClientId != null ? expectedClientId.trim() : "";
    }

    public static class VerifiedGoogleUser {
        private final String email;
        private final String fullName;
        private final String googleSubjectId;

        public VerifiedGoogleUser(String email, String fullName, String googleSubjectId) {
            this.email = email;
            this.fullName = fullName;
            this.googleSubjectId = googleSubjectId;
        }

        public String getEmail() {
            return email;
        }

        public String getFullName() {
            return fullName;
        }

        public String getGoogleSubjectId() {
            return googleSubjectId;
        }
    }

    public VerifiedGoogleUser verifyToken(String idToken, String accessToken) {
        if ((idToken == null || idToken.isBlank()) && (accessToken == null || accessToken.isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Google idToken or accessToken must be provided");
        }

        try {
            if (idToken != null && !idToken.isBlank()) {
                String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken.trim();
                String responseBody = restTemplate.getForObject(url, String.class);
                if (responseBody == null) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google ID token response");
                }

                JsonNode root = objectMapper.readTree(responseBody);
                String email = root.path("email").asText();
                String emailVerified = root.path("email_verified").asText();
                String name = root.path("name").asText();
                String sub = root.path("sub").asText();
                String aud = root.path("aud").asText();

                if (email == null || email.isBlank() || !"true".equalsIgnoreCase(emailVerified)) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google email not verified");
                }

                if (!expectedClientId.isEmpty() && !expectedClientId.equals(aud)) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google token audience mismatch");
                }

                return new VerifiedGoogleUser(
                        email.trim().toLowerCase(),
                        name != null && !name.isBlank() ? name.trim() : email.split("@")[0],
                        sub
                );
            } else {
                String url = "https://www.googleapis.com/oauth2/v3/userinfo";
                org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
                headers.setBearerAuth(accessToken.trim());
                org.springframework.http.HttpEntity<Void> entity = new org.springframework.http.HttpEntity<>(headers);

                org.springframework.http.ResponseEntity<String> response = restTemplate.exchange(
                        url,
                        org.springframework.http.HttpMethod.GET,
                        entity,
                        String.class
                );

                if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google Access Token");
                }

                JsonNode root = objectMapper.readTree(response.getBody());
                String email = root.path("email").asText();
                boolean emailVerified = root.path("email_verified").asBoolean(true);
                String name = root.path("name").asText();
                String sub = root.path("sub").asText();

                if (email == null || email.isBlank() || !emailVerified) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google email not verified");
                }

                return new VerifiedGoogleUser(
                        email.trim().toLowerCase(),
                        name != null && !name.isBlank() ? name.trim() : email.split("@")[0],
                        sub
                );
            }
        } catch (ResponseStatusException rse) {
            throw rse;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google token verification failed: " + e.getMessage());
        }
    }
}
