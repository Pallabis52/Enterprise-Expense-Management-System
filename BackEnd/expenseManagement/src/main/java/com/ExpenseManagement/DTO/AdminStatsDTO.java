package com.expensemanagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDTO {
    private Double totalSpent;
    private Double avgMonthlySpend;
    private Long categoryCount;
    private Long userCount;
    private Long teamCount;
    private Long pendingCount;
    private Long approvedCount;
    private Long rejectedCount;
}
