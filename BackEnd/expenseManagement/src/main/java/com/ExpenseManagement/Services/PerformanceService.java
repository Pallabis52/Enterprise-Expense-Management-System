package com.expensemanagement.Services;

import com.expensemanagement.DTO.Performance.TeamPerformanceDTO;
import com.expensemanagement.Entities.Approval_Status;
import com.expensemanagement.Entities.Team;
import com.expensemanagement.Entities.User;
import com.expensemanagement.Repository.ExpenseRepository;
import com.expensemanagement.Repository.TeamRepository;
import com.expensemanagement.Repository.UserRepository;
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
    private final TeamRepository teamRepository;

    public TeamPerformanceDTO getTeamPerformance(Long managerId) {
        // 1. Get Team
        User manager = userRepository.findById(managerId).orElseThrow();
        Team teamEntity = teamRepository.findByManager(manager).orElse(null);

        if (teamEntity == null) {
            return new TeamPerformanceDTO();
        }

        List<User> members = userRepository.findByTeam(teamEntity);
        if (members.isEmpty()) {
            return new TeamPerformanceDTO(); // Return empty stats
        }

        // 2. Aggregate Data
        Double totalSpent = expenseRepository.sumTotalAmountByUserIn(members);

        Long approvedCount = expenseRepository.countByUserInAndStatus(members, Approval_Status.APPROVED);
        Long rejectedCount = expenseRepository.countByUserInAndStatus(members, Approval_Status.REJECTED);
        Long pendingCount = expenseRepository.countByUserInAndStatus(members, Approval_Status.PENDING);
        Long totalCount = (approvedCount != null ? approvedCount : 0L) +
                (rejectedCount != null ? rejectedCount : 0L) +
                (pendingCount != null ? pendingCount : 0L);

        // 3. Category Breakdown
        List<Object[]> catStats = expenseRepository.sumAmountByCategoryByUserIn(members);
        Map<String, Double> categorySpend = new HashMap<>();
        for (Object[] row : catStats) {
            String cat = (String) row[0];
            Double amount = (Double) row[1];
            if (cat != null)
                categorySpend.put(cat, amount);
        }

        // 4. Monthly Spend
        List<Object[]> monthStats = expenseRepository.sumAmountByMonthByUserIn(members);
        Map<String, Double> monthlySpend = new HashMap<>();
        for (Object[] row : monthStats) {
            String month = (String) row[0];
            Double amount = (Double) row[1];
            if (month != null)
                monthlySpend.put(month, amount);
        }

        // 5. Top Spender
        List<Object[]> topSpenders = expenseRepository.findTopSpenders(members);
        String topSpenderName = "N/A";
        Double topSpenderAmount = 0.0;
        if (!topSpenders.isEmpty()) {
            User user = (User) topSpenders.get(0)[0];
            topSpenderName = user.getName();
            topSpenderAmount = (Double) topSpenders.get(0)[1];
        }

        double avgPerMember = members.size() > 0 && totalSpent != null ? totalSpent / members.size() : 0.0;

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
