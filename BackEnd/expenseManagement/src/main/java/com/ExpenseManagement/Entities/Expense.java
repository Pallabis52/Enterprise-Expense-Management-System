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
    private String recipturl;

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
}
