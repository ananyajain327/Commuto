package Commuto.Backend.dto;

import java.util.List;

public record SafetySummaryResponse(
        int safetyScore,
        int contactCount,
        boolean profileVerified,
        boolean hasPrimaryContact,
        boolean hasPreferencesConfigured,
        List<EmergencyContactResponse> contacts,
        List<SosAlertResponse> activeAlerts
) {
}
