package com.expensemanagement.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "vendor_stats")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String vendorName;

    @Builder.Default
    private Long transactionCount = 0L;

    @Builder.Default
    private Double totalAmount = 0.0;

    @Builder.Default
    private Double avgAmount = 0.0;

    @Column(columnDefinition = "boolean default false")
    @Builder.Default
    private boolean suspicious = false;

    private String suspiciousReason;

    private LocalDate lastSeen;
}
