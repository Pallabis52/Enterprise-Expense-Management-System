package com.expensemanagement.services;

import com.expensemanagement.AI.VoiceIntent;
import com.expensemanagement.AI.VoiceResponse;
import com.expensemanagement.entities.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

/**
 * VoiceActionService — Orchestrating layer between the controller and
 * VoiceIntentService.
 *
 * Responsibilities:
 * 1. Map raw intent string → VoiceIntent enum (type-safe).
 * 2. Enforce role-based access control BEFORE delegating to VoiceIntentService.
 * 3. Return standardised VoiceResponse with status = SUCCESS | UNAUTHORIZED |
 * ERROR | UNKNOWN.
 *
 * Role permission matrix (enforced by VoiceIntent enum):
 *
 * USER: ADD_EXPENSE · SHOW_EXPENSES · CHECK_STATUS · SPENDING_SUMMARY · AI_CHAT
 * · SEARCH
 * MANAGER: + APPROVE_EXPENSE · REJECT_EXPENSE · TEAM_SUMMARY · TEAM_QUERY ·
 * RISK_INSIGHTS
 * ADMIN: + FRAUD_ALERTS · AUDIT_REPORT · BUDGET_QUERY · VENDOR_ROI ·
 * POLICY_INSIGHTS
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VoiceActionService {

    private final VoiceIntentService voiceIntentService;

    /**
     * Primary entry point — validates role, then delegates execution.
     *
     * @param transcript raw voice text from the user
     * @param user       authenticated user (role + id available)
     * @return CompletableFuture<VoiceResponse> with status set
     */
    public CompletableFuture<VoiceResponse> execute(String transcript, User user) {
        long start = System.currentTimeMillis();
        String role = user.getRole() != null ? user.getRole().name() : "USER";

        // ── 1. Quick keyword pre-check for role gating before an expensive AI call ──
        // We do a lightweight keyword scan to detect obviously role-restricted intents.
        // The actual execution uses the full AI pipeline inside VoiceIntentService.
        VoiceIntent quickIntent = detectQuickIntent(transcript);
        if (quickIntent != VoiceIntent.UNKNOWN && !quickIntent.isAllowedFor(role)) {
            log.warn("Voice UNAUTHORIZED: user={}, role={}, quickIntent={}",
                    user.getEmail(), role, quickIntent);
            return CompletableFuture.completedFuture(
                    VoiceResponse.unauthorized(quickIntent.name(),
                            System.currentTimeMillis() - start));
        }

        // ── 2. Full AI + keyword pipeline ─────────────────────────────────────────
        return voiceIntentService.resolveAsync(transcript, user)
                .thenApply(response -> {
                    // ── 3. Post-resolution role check ─────────────────────────
                    VoiceIntent finalIntent = VoiceIntent.parse(response.getIntent());
                    if (finalIntent != VoiceIntent.UNKNOWN && !finalIntent.isAllowedFor(role)) {
                        log.warn("Voice UNAUTHORIZED (post-AI): user={}, role={}, intent={}",
                                user.getEmail(), role, finalIntent);
                        return VoiceResponse.unauthorized(finalIntent.name(),
                                System.currentTimeMillis() - start);
                    }
                    return response;
                })
                .exceptionally(ex -> {
                    log.error("VoiceActionService execution error for user={}: {}",
                            user.getEmail(), ex.getMessage(), ex);
                    return VoiceResponse.fallback(System.currentTimeMillis() - start);
                });
    }

    // ── Lightweight keyword pre-screener ──────────────────────────────────────
    // Catches obvious role-gate violations before spending an AI roundtrip.

    private VoiceIntent detectQuickIntent(String text) {
        String lower = text.toLowerCase();

        if (contains(lower, "approve"))
            return VoiceIntent.APPROVE_EXPENSE;
        if (contains(lower, "reject"))
            return VoiceIntent.REJECT_EXPENSE;
        if (contains(lower, "team summary", "team spend"))
            return VoiceIntent.TEAM_SUMMARY;
        if (contains(lower, "risk", "risky"))
            return VoiceIntent.RISK_INSIGHTS;
        if (contains(lower, "fraud"))
            return VoiceIntent.FRAUD_ALERTS;
        if (contains(lower, "audit"))
            return VoiceIntent.AUDIT_REPORT;
        if (contains(lower, "budget"))
            return VoiceIntent.BUDGET_QUERY;
        if (contains(lower, "policy", "policies"))
            return VoiceIntent.POLICY_INSIGHTS;
        if (contains(lower, "vendor"))
            return VoiceIntent.VENDOR_ROI;

        return VoiceIntent.UNKNOWN;
    }

    /** Vararg helper — returns true if text contains ANY of the given keywords. */
    private boolean contains(String text, String... keywords) {
        for (String kw : keywords) {
            if (text.contains(kw))
                return true;
        }
        return false;
    }
}
