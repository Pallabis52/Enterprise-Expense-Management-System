package com.expensemanagement.Services;

import com.expensemanagement.Entities.User;
import com.expensemanagement.Repository.ExpenseRepository;
import com.expensemanagement.Repository.TeamBudgetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class BudgetGuardService {

    private final ExpenseRepository expenseRepository;
    private final TeamBudgetRepository teamBudgetRepository;

    /**
     * Checks if current month's spending exceeds team budget limit.
     */
    public BudgetWarning checkBudget(User user, double newAmount) {
        if (user == null || user.getTeam() == null)
            return null;

        try {
            LocalDate now = LocalDate.now();
            Double currentSpend = expenseRepository.sumAmountByUserInAndMonth(
                    user.getTeam().getMembers(),
                    now.getMonthValue(),
                    now.getYear());

            if (currentSpend == null)
                currentSpend = 0.0;

            // Fetch team budget limit
            double limit = teamBudgetRepository
                    .findByTeamAndMonthAndYear(user.getTeam(), now.getMonthValue(), now.getYear())
                    .map(b -> b.getBudgetAmount())
                    .orElse(1000000.0);

            if (currentSpend + newAmount > limit) {
                return new BudgetWarning(true, currentSpend, limit);
            }
        } catch (Exception e) {
            log.error("Budget check failed (non-blocking): {}", e.getMessage());
        }
        return null;
    }

    public record BudgetWarning(boolean exceeded, double currentSpend, double limit) {
    }
}
