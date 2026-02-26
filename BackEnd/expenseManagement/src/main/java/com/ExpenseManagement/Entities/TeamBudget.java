package com.expensemanagement.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Stores the monthly budget set by Admin for each Team.
 * One record per (team, month, year) combination.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "team_budgets", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "team_id", "month", "year" })
})
public class TeamBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "members", "manager" })
    private Team team;

    /** Calendar month (1–12) */
    @Column(nullable = false)
    private int month;

    /** Calendar year, e.g. 2025 */
    @Column(nullable = false)
    private int year;

    /** Budget ceiling set by admin (in base currency) */
    @Column(nullable = false)
    private Double budgetAmount;
}
