package com.expensemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

public class AIDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SearchFilters {
        private String status;
        private String category;
        private Double minAmount;
        private String month;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatRequest {
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VoiceParseResult {
        private Double amount;
        private String category;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DuplicateDetectionResult {
        private String duplicate; // "yes" or "no"
        private String reason;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApprovalRecommendation {
        private String decision; // "APPROVE" or "REJECT"
        private String reason;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MoodInsight {
        private String mood; // stress | routine | celebration | urgent | unknown
        private String explanation;
        private String suggestion;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ConfidenceScoreResult {
        private int score; // 0-100
        private String riskLevel; // High | Medium | Low
        private String breakdown;
    }
}
