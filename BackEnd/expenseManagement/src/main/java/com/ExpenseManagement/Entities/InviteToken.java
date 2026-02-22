package com.expensemanagement.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InviteToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role; // Role to be assigned

    private Long managerId; // If invited by manager, assign to this manager

    @Column(unique = true, nullable = false)
    private String token;

    @Enumerated(EnumType.STRING)
    private InviteStatus status; // PENDING, ACCEPTED, EXPIRED

    private LocalDateTime expiryDate;

    public enum InviteStatus {
        PENDING, ACCEPTED, EXPIRED
    }
}
