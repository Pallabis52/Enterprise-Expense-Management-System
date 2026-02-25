package com.expensemanagement.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String entityType; // "EXPENSE", "USER", "POLICY"
    private Long entityId;

    private String action; // "CREATED", "SUBMITTED", "APPROVED", "REJECTED", "DELETED"
    private String performedBy; // username

    @Column(columnDefinition = "TEXT")
    private String details; // JSON blob with context

    private String role; // ADMIN, MANAGER, USER

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        this.timestamp = LocalDateTime.now();
    }
}
