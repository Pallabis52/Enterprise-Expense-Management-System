package com.expensemanagement.Services;

import com.expensemanagement.Entities.Approval_Status;
import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.User;
import com.expensemanagement.Entities.Team;
import com.expensemanagement.Repository.ExpenseRepository;
import com.expensemanagement.Repository.TeamRepository;
import com.expensemanagement.Repository.UserRepository;
import com.expensemanagement.Notification.Notification;
import com.expensemanagement.Notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final NotificationService notificationService;
    private final TeamBudgetService teamBudgetService;

    // ── helpers ──────────────────────────────────────────────────────────────

    private Team getTeamForManager(Long managerId) {
        User manager = userRepository.findById(managerId).orElseThrow();
        return teamRepository.findByManager(manager).orElse(null);
    }

    private List<User> getTeamMembers(Team team) {
        return userRepository.findByTeam(team);
    }

    // ── read ─────────────────────────────────────────────────────────────────

    public Page<Expense> getTeamExpenses(Long managerId, Approval_Status status, Pageable pageable) {
        Team team = getTeamForManager(managerId);
        if (team == null)
            return Page.empty();
        List<User> members = getTeamMembers(team);
        if (members.isEmpty())
            return Page.empty();

        if (status != null) {
            return expenseRepository.findByUserInAndStatus(members, status, pageable);
        }
        return expenseRepository.findByUserIn(members, pageable);
    }

    public List<User> getTeamMembers(Long managerId) {
        Team team = getTeamForManager(managerId);
        if (team == null)
            return List.of();
        return getTeamMembers(team);
    }

    public Team getTeam(Long managerId) {
        return getTeamForManager(managerId);
    }

    // ── approval actions ─────────────────────────────────────────────────────

    @Transactional
    public Expense approveExpense(Long expenseId, Long managerId) {
        Expense expense = expenseRepository.findById(expenseId).orElseThrow();

        User manager = userRepository.findById(managerId).orElseThrow();
        Team team = teamRepository.findByManager(manager).orElseThrow();

        if (expense.getUser().getTeam() == null ||
                !expense.getUser().getTeam().getId().equals(team.getId())) {
            throw new com.expensemanagement.Exception.UnauthorizedAccessException(
                    "Unauthorized to approve this expense");
        }

        // Feature 1: amount rule enforcement
        if (expense.getAmount() > 10_000) {
            throw new com.expensemanagement.Exception.ApprovalNotAllowedException(
                    "Managers can only approve expenses up to ₹10,000. " +
                            "Use 'Forward to Admin' for amounts between ₹10,001–₹50,000.");
        }

        expense.setStatus(Approval_Status.APPROVED);
        expense.setApprovalStage("MANAGER");
        Expense saved = expenseRepository.save(expense);

        // Notify User
        notificationService.notifyUser(
                saved.getUser().getId(),
                "Expense Approved",
                "Your expense '" + saved.getTitle() + "' was approved by your manager.",
                Notification.NotificationType.SUCCESS,
                Notification.NotificationCategory.EXPENSE);

        // Feature 3: post-approval budget check
        checkAndNotifyBudget(team, managerId);

        return saved;
    }

    @Transactional
    public Expense rejectExpense(Long expenseId, String reason) {
        Expense expense = expenseRepository.findById(expenseId).orElseThrow();
        expense.setStatus(Approval_Status.REJECTED);
        expense.setRejectionReason(reason);
        expense.setApprovalComment(reason);
        expense.setApprovalStage("MANAGER");
        Expense saved = expenseRepository.save(expense);

        notificationService.notifyUser(
                saved.getUser().getId(),
                "Expense Rejected",
                "Your expense '" + saved.getTitle() + "' was rejected. Reason: " + reason,
                Notification.NotificationType.WARNING,
                Notification.NotificationCategory.EXPENSE);
        return saved;
    }

    /**
     * Feature 1 & 8: Manager forwards a mid-tier expense to Admin with a comment.
     * Valid for expenses between ₹10,001 – ₹50,000.
     * Expenses > ₹50,000 go directly to admin without needing forwarding.
     */
    @Transactional
    public Expense forwardToAdmin(Long expenseId, Long managerId, String comment) {
        Expense expense = expenseRepository.findById(expenseId).orElseThrow();

        User manager = userRepository.findById(managerId).orElseThrow();
        Team team = teamRepository.findByManager(manager).orElseThrow();

        if (expense.getUser().getTeam() == null ||
                !expense.getUser().getTeam().getId().equals(team.getId())) {
            throw new com.expensemanagement.Exception.UnauthorizedAccessException(
                    "Unauthorized to forward this expense");
        }

        if (expense.getAmount() <= 10_000) {
            throw new com.expensemanagement.Exception.ApprovalNotAllowedException(
                    "Expense is within manager approval limit (≤ ₹10,000). No need to forward.");
        }

        expense.setStatus(Approval_Status.FORWARDED_TO_ADMIN);
        expense.setApprovalStage("ADMIN");
        expense.setApprovalComment(comment);
        Expense saved = expenseRepository.save(expense);

        // Notify Admin role
        notificationService.notifyRole(
                com.expensemanagement.Entities.Role.ADMIN,
                "Expense Forwarded for Approval",
                String.format("Manager '%s' forwarded expense '%s' (₹%.2f) for admin approval. Note: %s",
                        manager.getName(), saved.getTitle(), saved.getAmount(), comment),
                Notification.NotificationType.ACTION,
                Notification.NotificationCategory.EXPENSE);

        // Notify user
        notificationService.notifyUser(
                saved.getUser().getId(),
                "Expense Forwarded to Admin",
                "Your expense '" + saved.getTitle() + "' has been forwarded to an administrator for approval.",
                Notification.NotificationType.INFO,
                Notification.NotificationCategory.EXPENSE);

        return saved;
    }

    // ── stats / dashboard ────────────────────────────────────────────────────

    public Double getTeamApprovedTotal(Long managerId) {
        Team team = getTeamForManager(managerId);
        if (team == null)
            return 0.0;
        List<User> members = getTeamMembers(team);
        if (members.isEmpty())
            return 0.0;
        Double total = expenseRepository.sumApprovedAmountByUserIn(members);
        return total != null ? total : 0.0;
    }

    public Double getTeamPendingTotal(Long managerId) {
        Team team = getTeamForManager(managerId);
        if (team == null)
            return 0.0;
        List<User> members = getTeamMembers(team);
        if (members.isEmpty())
            return 0.0;
        Double total = expenseRepository.sumPendingAmountByUserIn(members);
        return total != null ? total : 0.0;
    }

    /**
     * Feature 7: Manager dashboard – returns team KPIs and budget status.
     */
    public Map<String, Object> getManagerDashboard(Long managerId) {
        Team team = getTeamForManager(managerId);
        Map<String, Object> dashboard = new HashMap<>();

        if (team == null) {
            dashboard.put("error", "No team assigned to this manager");
            return dashboard;
        }

        List<User> members = getTeamMembers(team);
        LocalDate now = LocalDate.now();

        long pendingCount = members.isEmpty() ? 0
                : expenseRepository.countByUserInAndStatus(members, Approval_Status.PENDING);

        long forwardedCount = members.isEmpty() ? 0
                : expenseRepository.countByUserInAndStatus(members, Approval_Status.FORWARDED_TO_ADMIN);

        Double monthlySpend = members.isEmpty() ? 0.0
                : expenseRepository.sumAmountByUserInAndMonth(members, now.getMonthValue(), now.getYear());
        if (monthlySpend == null)
            monthlySpend = 0.0;

        List<Expense> flaggedExpenses = members.isEmpty() ? List.of()
                : expenseRepository.findByUserInAndIsDuplicateTrue(members);

        Map<String, Object> budgetStatus = teamBudgetService.getBudgetStatus(
                team.getId(), now.getMonthValue(), now.getYear());

        dashboard.put("teamId", team.getId());
        dashboard.put("teamName", team.getName());
        dashboard.put("pendingCount", pendingCount);
        dashboard.put("forwardedCount", forwardedCount);
        dashboard.put("monthlySpend", monthlySpend);
        dashboard.put("flaggedCount", flaggedExpenses.size());
        dashboard.put("flaggedExpenses", flaggedExpenses);
        dashboard.put("budget", budgetStatus);
        return dashboard;
    }

    // ── private utils ─────────────────────────────────────────────────────────

    private void checkAndNotifyBudget(Team team, Long managerId) {
        LocalDate now = LocalDate.now();
        try {
            Map<String, Object> status = teamBudgetService.getBudgetStatus(
                    team.getId(), now.getMonthValue(), now.getYear());
            Boolean exceeded = (Boolean) status.get("exceeded");
            if (Boolean.TRUE.equals(exceeded)) {
                double spent = ((Number) status.get("spent")).doubleValue();
                double budget = ((Number) status.get("budget")).doubleValue();
                teamBudgetService.notifyBudgetExceeded(team, spent, budget);
            }
        } catch (Exception ignored) {
            // Budget check is advisory, never block main flow
        }
    }
}
