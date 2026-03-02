package com.expensemanagement.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing a formal complaint within the system.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Complaint_Status status = Complaint_Status.SUBMITTED;

    @Enumerated(EnumType.STRING)
    private Complaint_Category category;

    @Enumerated(EnumType.STRING)
    private Complaint_Priority priority = Complaint_Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    private Complaint_Sentiment sentiment = Complaint_Sentiment.NEUTRAL;

    @Enumerated(EnumType.STRING)
    private Complaint_Department assignedDepartment;

    private Long expenseId;

    @Column(nullable = false, columnDefinition = "int default 0")
    private int riskScore = 0; // 0-100

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isDuplicate = false;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'USER'")
    private String roleLevel; // USER | MANAGER

    @Column(columnDefinition = "TEXT")
    private String response;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
