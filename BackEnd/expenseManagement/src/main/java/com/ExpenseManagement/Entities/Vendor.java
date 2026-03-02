package com.expensemanagement.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String category;

    @Builder.Default
    private Double totalSpend = 0.0;

    @Builder.Default
    private Long transactionCount = 0L;

    @Builder.Default
    private Double avgAmount = 0.0;

    @Builder.Default
    private Integer trustScore = 100;

    @Builder.Default
    private Integer anomalyCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
