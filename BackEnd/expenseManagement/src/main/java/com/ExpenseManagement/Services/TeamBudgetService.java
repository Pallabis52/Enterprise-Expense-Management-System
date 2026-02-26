package com.expensemanagement.services;

import com.expensemanagement.entities.Team;
import com.expensemanagement.entities.TeamBudget;
import com.expensemanagement.entities.User;
import com.expensemanagement.notification.NotificationService;
import com.expensemanagement.notification.Notification;
import com.expensemanagement.repository.ExpenseRepository;
import com.expensemanagement.repository.TeamBudgetRepository;
import com.expensemanagement.repository.TeamRepository;
import com.expensemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Manages monthly budget limits per team (Feature 3).
 * Admin sets a budget; system tracks spending and flags budget overruns.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TeamBudgetService {

    private final TeamBudgetRepository teamBudgetRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final NotificationService notificationService;

    /**
     * Admin sets or updates a monthly budget for a team.
     */
    @Transactional
    public TeamBudget setBudget(Long teamId, int month, int year, Double budgetAmount) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(
                        () -> new com.expensemanagement.exception.TeamNotFoundException("Team not found: " + teamId));

        TeamBudget budget = teamBudgetRepository.findByTeamAndMonthAndYear(team, month, year)
                .orElse(TeamBudget.builder().team(team).month(month).year(year).build());

        budget.setBudgetAmount(budgetAmount);
        TeamBudget saved = teamBudgetRepository.save(budget);
        log.info("Budget set for team={} month={}/{}: {}", team.getName(), month, year, budgetAmount);
        return saved;
    }

    /**
     * Returns the budget status for a team in the current month.
     * Response map includes: budget, spent, exceeded, teamId, teamName
     */
    public Map<String, Object> getBudgetStatus(Long teamId, int month, int year) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        List<User> members = userRepository.findByTeam(team);
        Double spent = members.isEmpty() ? 0.0 : expenseRepository.sumAmountByUserInAndMonth(members, month, year);
        if (spent == null)
            spent = 0.0;

        Double budget = teamBudgetRepository.findByTeamAndMonthAndYear(team, month, year)
                .map(TeamBudget::getBudgetAmount)
                .orElse(0.0);

        boolean exceeded = budget > 0 && spent > budget;

        Map<String, Object> result = new HashMap<>();
        result.put("teamId", teamId);
        result.put("teamName", team.getName());
        result.put("month", month);
        result.put("year", year);
        result.put("budget", budget);
        result.put("spent", spent);
        result.put("exceeded", exceeded);
        result.put("remaining", Math.max(0, budget - spent));
        return result;
    }

    /**
     * Returns budget status for all teams for the given month/year.
     * Used in admin dashboard for budget alerts.
     */
    public List<Map<String, Object>> getAllBudgetStatuses(int month, int year) {
        List<Team> teams = teamRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Team team : teams) {
            result.add(getBudgetStatus(team.getId(), month, year));
        }
        return result;
    }

    /**
     * Sends a budget exceeded notification to admin.
     * Called from ManagerService when team spend surpasses budget.
     */
    public void notifyBudgetExceeded(Team team, double spent, double budget) {
        notificationService.notifyRole(
                com.expensemanagement.entities.Role.ADMIN,
                "Budget Exceeded: " + team.getName(),
                String.format("Team '%s' has exceeded its monthly budget. Spent: ₹%.2f / Budget: ₹%.2f",
                        team.getName(), spent, budget),
                Notification.NotificationType.WARNING,
                Notification.NotificationCategory.BUDGET);
    }
}
