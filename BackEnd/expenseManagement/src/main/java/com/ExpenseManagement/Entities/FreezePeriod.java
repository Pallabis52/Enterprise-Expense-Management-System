package com.expensemanagement.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Controls expense submission freeze periods.
 * Admin can lock a (month, year) to prevent new expense submissions.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "freeze_periods", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "month", "year" })
})
public class FreezePeriod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Calendar month (1–12) */
    @Column(nullable = false)
    private int month;

    /** Calendar year, e.g. 2025 */
    @Column(nullable = false)
    private int year;

    /** Whether this period is locked for expense submissions */
    @Column(nullable = false)
    @lombok.Builder.Default
    private boolean locked = true;
}
