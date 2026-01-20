package com.ExpenseManagement.Services;

import com.ExpenseManagement.Entities.Approval_Status;
import com.ExpenseManagement.Entities.Expense;
import com.ExpenseManagement.Entities.User;
import com.ExpenseManagement.Repository.ExpenseRepository;
import com.ExpenseManagement.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ManagerService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.ExpenseManagement.Notification.NotificationService notificationService;

    public Page<Expense> getTeamExpenses(Long managerId, Approval_Status status, Pageable pageable) {
        List<User> team = userRepository.findByManagerId(managerId);
        if (team.isEmpty())
            return Page.empty();

        if (status != null) {
            return expenseRepository.findByUserInAndStatus(team, status, pageable);
        }
        return expenseRepository.findByUserIn(team, pageable);
    }

    public Expense approveExpense(Long expenseId, Long managerId) {
        Expense expense = expenseRepository.findById(expenseId).orElseThrow();
        expense.setStatus(Approval_Status.APPROVED);
        Expense saved = expenseRepository.save(expense);

        // Notify User
        notificationService.notifyUser(
                saved.getUser().getId(),
                "Expense Approved",
                "Your expense '" + saved.getTitle() + "' was approved.",
                com.ExpenseManagement.Notification.Notification.NotificationType.SUCCESS);
        return saved;
    }

    public Expense rejectExpense(Long expenseId, String reason) {
        Expense expense = expenseRepository.findById(expenseId).orElseThrow();
        expense.setStatus(Approval_Status.REJECTED);
        expense.setRejectionReason(reason);
        Expense saved = expenseRepository.save(expense);

        // Notify User
        notificationService.notifyUser(
                saved.getUser().getId(),
                "Expense Rejected",
                "Your expense '" + saved.getTitle() + "' was rejected. Reason: " + reason,
                com.ExpenseManagement.Notification.Notification.NotificationType.WARNING);
        return saved;
    }

    // Stats logic
    public Double getTeamApprovedTotal(Long managerId) {
        List<User> team = userRepository.findByManagerId(managerId);
        if (team.isEmpty())
            return 0.0;
        return expenseRepository.sumApprovedAmountByUserIn(team);
    }

    public Double getTeamPendingTotal(Long managerId) {
        List<User> team = userRepository.findByManagerId(managerId);
        if (team.isEmpty())
            return 0.0;
        return expenseRepository.sumPendingAmountByUserIn(team);
    }
}
