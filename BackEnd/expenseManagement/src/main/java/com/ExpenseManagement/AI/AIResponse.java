package com.expensemanagement.AI;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Unified response DTO returned by every AI feature endpoint.
 * <p>
 * Both @NoArgsConstructor and @AllArgsConstructor are required so that
 * Spring's @Cacheable (Caffeine) can serialize/deserialize instances correctly.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIResponse {

        /** Which AI feature produced this response (e.g. "categorize", "risk-score") */
        private String feature;

        /** The AI-generated text result */
        private String result;

        /** Model that produced the answer */
        private String model;

        /** Processing time in milliseconds */
        private long processingMs;

        /** True when Ollama was unreachable and a safe default was returned */
        private boolean fallback;

        // ── Factories ────────────────────────────────────────────────────────────

        public static AIResponse success(String feature, String result, String model, long ms) {
                return AIResponse.builder()
                                .feature(feature)
                                .result(result)
                                .model(model)
                                .processingMs(ms)
                                .fallback(false)
                                .build();
        }

        public static AIResponse fallback(String feature, long ms) {
                return AIResponse.builder()
                                .feature(feature)
                                .result(FallbackMessages.get(feature))
                                .model("offline")
                                .processingMs(ms)
                                .fallback(true)
                                .build();
        }

        public static AIResponse error(String message) {
                return AIResponse.builder()
                                .feature("error")
                                .result(message)
                                .model("system")
                                .processingMs(0)
                                .fallback(true)
                                .build();
        }

        /** Safe default messages shown when AI is offline */
        static final class FallbackMessages {
                private static final java.util.Map<String, String> MAP = java.util.Map.ofEntries(
                                java.util.Map.entry("categorize",
                                                "Could not auto-categorize. Please select a category manually."),
                                java.util.Map.entry("explain-rejection",
                                                "Your expense was rejected. Please review the manager's comment and resubmit with corrections."),
                                java.util.Map.entry("spending-insights",
                                                "AI insights are temporarily unavailable. Check your expense history for trends."),
                                java.util.Map.entry("approve-recommend",
                                                "AI recommendation unavailable. Please review the expense details manually."),
                                java.util.Map.entry("risk-score",
                                                "Risk analysis unavailable. Please review based on company policy."),
                                java.util.Map.entry("team-summary",
                                                "Team spending summary unavailable. Please check the reports section."),
                                java.util.Map.entry("fraud-insights",
                                                "Fraud analysis is temporarily unavailable. Manual review recommended."),
                                java.util.Map.entry("budget-prediction",
                                                "Budget prediction unavailable. Monitor current spending against limits."),
                                java.util.Map.entry("policy-violations",
                                                "Policy violation scan unavailable. Please review expenses manually."),
                                java.util.Map.entry("chatbot",
                                                "I'm temporarily offline. Please check back shortly or contact your administrator."),
                                java.util.Map.entry("voice-intent",
                                                "Voice command understanding is unavailable. Please type your search instead."),
                                java.util.Map.entry("voice-reply",
                                                "Action completed successfully."),
                                java.util.Map.entry("enhance-description",
                                                "AI could not enhance the description. Using basic details."),
                                java.util.Map.entry("vendor-roi",
                                                "Vendor ROI analysis is temporarily unavailable. Please check the reports section."));

                static String get(String feature) {
                        return MAP.getOrDefault(feature,
                                        "AI service is temporarily unavailable. Please try again later.");
                }

                private FallbackMessages() {
                }
        }
}
