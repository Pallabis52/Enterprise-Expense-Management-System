package com.expensemanagement.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fraud_rules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FraudRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String ruleName; // e.g. "DUPLICATE_24H", "WEEKEND_HIGH_AMOUNT", "RAPID_REPEAT"

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "boolean default true")
    @Builder.Default
    private boolean active = true;

    private Double thresholdAmount; // optional amount threshold

    private Integer thresholdCount; // optional count threshold (e.g. 3 in 1h)

    private Integer thresholdWindowHours; // time window

    private String createdBy;
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
