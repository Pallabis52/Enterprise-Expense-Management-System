package com.ExpenseManagement.Services;

import com.ExpenseManagement.DTO.Performance.TeamPerformanceDTO;
import com.ExpenseManagement.Entities.Approval_Status;
import com.ExpenseManagement.Entities.User;
import com.ExpenseManagement.Repository.ExpenseRepository;
import com.ExpenseManagement.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PerformanceService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public TeamPerformanceDTO getTeamPerformance(Long managerId) {
        // 1. Get Team
        List<User> team = userRepository.findByManagerId(managerId);
        if (team.isEmpty()) {
            return new TeamPerformanceDTO(); // Return empty stats
        }

        // 2. Aggregate Data
        Double totalSpent = expenseRepository.sumTotalAmountByUserIn(team);

        Long approvedCount = expenseRepository.countByUserInAndStatus(team, Approval_Status.APPROVED);
        Long rejectedCount = expenseRepository.countByUserInAndStatus(team, Approval_Status.REJECTED);
        Long pendingCount = expenseRepository.countByUserInAndStatus(team, Approval_Status.PENDING);
        Long totalCount = approvedCount + rejectedCount + pendingCount; // Approximate total queried

        // 3. Category Breakdown
        List<Object[]> catStats = expenseRepository.sumAmountByCategoryByUserIn(team);
        Map<String, Double> categorySpend = new HashMap<>();
        for (Object[] row : catStats) {
            String cat = (String) row[0];
            Double amount = (Double) row[1];
            if (cat != null)
                categorySpend.put(cat, amount);
        }

        // 4. Monthly Spend (Native Query Result might vary, handling basic object
        // mapping)
        List<Object[]> monthStats = expenseRepository.sumAmountByMonthByUserIn(team);
        Map<String, Double> monthlySpend = new HashMap<>();
        for (Object[] row : monthStats) {
            String month = (String) row[0];
            Double amount = (Double) row[1];
            if (month != null)
                monthlySpend.put(month, amount);
        }

        // 5. Top Spender
        List<Object[]> topSpenders = expenseRepository.findTopSpenders(team);
        String topSpenderName = "N/A";
        Double topSpenderAmount = 0.0;
        if (!topSpenders.isEmpty()) {
            User user = (User) topSpenders.get(0)[0];
            topSpenderName = user.getName();
            topSpenderAmount = (Double) topSpenders.get(0)[1];
        }

        double avgPerMember = team.size() > 0 && totalSpent != null ? totalSpent / team.size() : 0.0;

        return TeamPerformanceDTO.builder()
                .totalSpent(totalSpent != null ? totalSpent : 0.0)
                .totalExpensesCount(totalCount)
                .approvedCount(approvedCount != null ? approvedCount : 0L)
                .rejectedCount(rejectedCount != null ? rejectedCount : 0L)
                .pendingCount(pendingCount != null ? pendingCount : 0L)
                .avgExpensePerMember(avgPerMember)
                .topSpenderName(topSpenderName)
                .topSpenderAmount(topSpenderAmount)
                .categorySpend(categorySpend)
                .monthlySpend(monthlySpend)
                .build();
    }
}
