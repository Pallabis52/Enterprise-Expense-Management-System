package com.expensemanagement.Entities;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private double amount;
    private String description;
    private LocalDate date;

    @Lob
    @jakarta.persistence.Column(name = "receipt_url")
    private String receiptUrl;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "password", "teamMembers", "manager", "roles",
            "authorities" })
    private User user;

    // Storing category name for simplicity or we can allow relation.
    // Given frontend sends category name often, let's keep it simple or map it.
    // The previous code had Enum. Let's change to String to allow our new Dynamic
    // Categories.
    private String category;

    @Enumerated(EnumType.STRING)
    private Approval_Status status;

    // Rejection reason
    private String rejectionReason;

    // --- Advanced Approval Workflow Fields ---

    /** Tracks which approval level is responsible: "MANAGER" or "ADMIN" */
    private String approvalStage;

    /** Comment left by manager or admin when approving, rejecting, or forwarding */
    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String approvalComment;

    /** System-flagged as a potential duplicate expense */
    @jakarta.persistence.Column(columnDefinition = "boolean default false")
    private boolean isDuplicate = false;

    // ── Phase 1 additions (all backward-safe with defaults) ────────────────

    /** Draft mode: saved but not submitted */
    @jakarta.persistence.Column(columnDefinition = "boolean default false")
    private boolean draft = false;

    /** Vendor / merchant name (for vendor analytics & fraud) */
    private String vendorName;

    /** AI-computed risk/confidence score 0–100 */
    @jakarta.persistence.Column(columnDefinition = "float8 default 0")
    private Double confidenceScore = 0.0;

    /** SLA deadline for manager approval */
    private java.time.LocalDateTime slaDeadAt;

    @jakarta.persistence.Column(columnDefinition = "boolean default false")
    private boolean overdue = false;

    // Explicit Getters/Setters for newly added fields to ensure visibility
    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public Double getConfidenceScore() {
        return confidenceScore != null ? confidenceScore : 0.0;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public boolean isOverdue() {
        return overdue;
    }

    public void setOverdue(boolean overdue) {
        this.overdue = overdue;
    }
}
