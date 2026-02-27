package com.expensemanagement.AI;

import java.util.Set;

/**
 * All supported voice command intents.
 *
 * Each intent declares which roles are authorised to invoke it.
 * VoiceActionService enforces these permissions at runtime.
 */
public enum VoiceIntent {

    // ── USER intents ──────────────────────────────────────────────────────────
    ADD_EXPENSE(Set.of("USER", "MANAGER", "ADMIN")),
    SHOW_EXPENSES(Set.of("USER", "MANAGER", "ADMIN")),
    AI_CHAT(Set.of("USER", "MANAGER", "ADMIN")),
    SEARCH(Set.of("USER", "MANAGER", "ADMIN")),
    CHECK_STATUS(Set.of("USER", "MANAGER", "ADMIN")),
    SPENDING_SUMMARY(Set.of("USER", "MANAGER", "ADMIN")),

    // ── MANAGER intents ───────────────────────────────────────────────────────
    APPROVE_EXPENSE(Set.of("MANAGER", "ADMIN")),
    REJECT_EXPENSE(Set.of("MANAGER", "ADMIN")),
    TEAM_SUMMARY(Set.of("MANAGER", "ADMIN")),
    TEAM_QUERY(Set.of("MANAGER", "ADMIN")),
    RISK_INSIGHTS(Set.of("MANAGER", "ADMIN")),

    // ── ADMIN intents ─────────────────────────────────────────────────────────
    FRAUD_ALERTS(Set.of("ADMIN")),
    FRAUD_QUERY(Set.of("ADMIN")),
    AUDIT_REPORT(Set.of("ADMIN")),
    BUDGET_QUERY(Set.of("ADMIN")),
    VENDOR_ROI(Set.of("ADMIN")),
    POLICY_INSIGHTS(Set.of("ADMIN")),

    // ── Fallback ──────────────────────────────────────────────────────────────
    UNKNOWN(Set.of("USER", "MANAGER", "ADMIN"));

    /** Roles allowed to execute this intent. */
    private final Set<String> allowedRoles;

    VoiceIntent(Set<String> allowedRoles) {
        this.allowedRoles = allowedRoles;
    }

    /** Returns true if the given role can execute this intent. */
    public boolean isAllowedFor(String role) {
        return allowedRoles.contains(role);
    }

    /**
     * Safe parse — returns UNKNOWN instead of throwing for unrecognised strings.
     * Used when mapping AI-detected strings to enum values.
     */
    public static VoiceIntent parse(String value) {
        if (value == null)
            return UNKNOWN;
        try {
            return valueOf(value.toUpperCase().trim());
        } catch (IllegalArgumentException ex) {
            return UNKNOWN;
        }
    }
}
