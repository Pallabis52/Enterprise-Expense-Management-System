package com.expensemanagement.dto.Performance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamPerformanceDTO {
    private Double totalSpent;
    private Long totalExpensesCount;

    private Long approvedCount;
    private Long rejectedCount;
    private Long pendingCount;

    private Double avgExpensePerMember;
    private String topSpenderName;
    private Double topSpenderAmount;

    // Charts Data
    private Map<String, Double> categorySpend; // Category -> Amount
    private Map<String, Double> monthlySpend; // Month -> Amount
}
