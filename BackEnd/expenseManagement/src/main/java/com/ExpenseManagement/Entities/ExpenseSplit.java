package com.expensemanagement.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "expense_splits")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSplit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "expense_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "user", "splits" })
    private Expense expense;

    @ManyToOne
    @JoinColumn(name = "split_with_user_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "password", "teamMembers", "manager", "roles",
            "authorities" })
    private User splitWithUser;

    private Double splitAmount;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING"; // PENDING, SETTLED

    private LocalDateTime createdAt;
    private LocalDateTime settledAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
