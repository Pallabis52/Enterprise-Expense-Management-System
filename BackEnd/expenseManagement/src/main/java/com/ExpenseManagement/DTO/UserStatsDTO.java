package com.expensemanagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDTO {
    private Double totalSpent;
    private Long pendingCount;
    private Long approvedCount;
    private Long rejectedCount;
}
