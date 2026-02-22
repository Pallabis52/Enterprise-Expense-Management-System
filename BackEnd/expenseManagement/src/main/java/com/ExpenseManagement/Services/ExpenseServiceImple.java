package com.expensemanagement.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.expensemanagement.Entities.Approval_Status;
import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.Role;
import com.expensemanagement.Entities.Team;
import com.expensemanagement.Entities.User;
import com.expensemanagement.Exception.ApprovalNotAllowedException;
import com.expensemanagement.Exception.FreezePeriodException;
import com.expensemanagement.Notification.Notification;
import com.expensemanagement.Notification.NotificationService;
import com.expensemanagement.Repository.ExpenseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImple implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final NotificationService notificationService;
    private final CategoryResolver categoryResolver;
    private final DuplicateDetectionService duplicateDetectionService;
    private final FreezePeriodService freezePeriodService;

    // ── basic reads ───────────────────────────────────────────────────────────

    public List<Expense> getbymonthandyear(int month, int year) {
        return expenseRepository.findByMonthAndYear(month, year);
    }

    public List<Expense> getExpensesByCategory(String category) {
        return expenseRepository.findByCategory(category);
    }

    public List<Expense> getallExpenses() {
        return expenseRepository.findAll();
    }

    public Expense getById(long id) {
        return expenseRepository.findById(id).orElse(null);
    }

    // ── save (Feature 4, 5, 6, 9) ─────────────────────────────────────────────

    public Expense saveExpense(Expense expense) {
        if (expense == null) {
            throw new IllegalArgumentException("Expense cannot be null");
        }

        // Feature 4: Freeze period check (skip for ADMIN role submissions)
        boolean isAdminSubmission = expense.getUser() != null &&
                expense.getUser().getRole() == Role.ADMIN;
        if (!isAdminSubmission && freezePeriodService.isCurrentMonthFrozen()) {
            throw new FreezePeriodException(
                    "Expense submission is currently locked for this period. " +
                            "Contact your administrator to unlock.");
        }

        // Feature 5: Auto-categorize if category is blank
        if (expense.getCategory() == null || expense.getCategory().isBlank()) {
            expense.setCategory(categoryResolver.resolve(expense.getTitle(), expense.getDescription()));
        }

        // Feature 6: Duplicate detection (flag, do not block)
        if (duplicateDetectionService.isDuplicate(expense)) {
            expense.setDuplicate(true);
        }

        // Default status
        if (expense.getStatus() == null) {
            expense.setStatus(Approval_Status.PENDING);
        }

        // Feature 1: Set initial approval stage based on amount
        if (expense.getApprovalStage() == null) {
            if (expense.getAmount() > 50_000) {
                expense.setApprovalStage("ADMIN");
            } else {
                expense.setApprovalStage("MANAGER");
            }
        }

        Expense saved = expenseRepository.save(expense);

        // Feature 9: Notify Team Manager
        User user = saved.getUser();
        if (user != null && user.getTeam() != null && user.getTeam().getManager() != null) {
            User manager = user.getTeam().getManager();
            notificationService.notifyUser(
                    manager.getId(),
                    "New Expense Submitted",
                    user.getName() + " submitted a new expense: " + saved.getTitle() +
                            " (₹" + saved.getAmount() + ")",
                    Notification.NotificationType.INFO,
                    Notification.NotificationCategory.EXPENSE);

            // Feature 9: Notify Admin for expenses > ₹10,000
            if (saved.getAmount() > 10_000) {
                notificationService.notifyRole(
                        Role.ADMIN,
                        "High-Value Expense Submitted",
                        user.getName() + " submitted a high-value expense: " + saved.getTitle() +
                                " (₹" + saved.getAmount() + ") – requires admin attention.",
                        Notification.NotificationType.WARNING,
                        Notification.NotificationCategory.EXPENSE);
            }
        }

        // Feature 6: Notify manager about duplicates
        if (saved.isDuplicate() && user != null && user.getTeam() != null &&
                user.getTeam().getManager() != null) {
            notificationService.notifyUser(
                    user.getTeam().getManager().getId(),
                    "Possible Duplicate Expense",
                    "Expense '" + saved.getTitle() + "' from " + user.getName() +
                            " may be a duplicate. Please review.",
                    Notification.NotificationType.WARNING,
                    Notification.NotificationCategory.EXPENSE);
        }

        return saved;
    }

    // ── crud ──────────────────────────────────────────────────────────────────

    public boolean deleteExpense(long id) {
        Optional<Expense> getexpense = expenseRepository.findById(id);
        if (getexpense.isPresent()) {
            expenseRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Expense updateById(long id, Expense expense) {
        Optional<Expense> result = expenseRepository.findById(id);
        if (result.isPresent()) {
            Expense expenseToUpdate = result.get();
            expenseToUpdate.setAmount(expense.getAmount());
            expenseToUpdate.setTitle(expense.getTitle());
            expenseToUpdate.setDate(expense.getDate());
            expenseToUpdate.setCategory(expense.getCategory());
            expenseToUpdate.setDescription(expense.getDescription());
            return expenseRepository.save(expenseToUpdate);
        }
        return null;
    }

    // ── user-specific ─────────────────────────────────────────────────────────

    public Page<Expense> getUserExpenses(User user, Pageable pageable) {
        return expenseRepository.findByUser(user, pageable);
    }

    public Double getUserTotalSpent(User user) {
        Double total = expenseRepository.sumTotalAmountByUser(user);
        return total != null ? total : 0.0;
    }

    public Double getUserTotalByStatus(User user, Approval_Status status) {
        Double total = expenseRepository.sumAmountByUserAndStatus(user, status);
        return total != null ? total : 0.0;
    }

    public Long getUserCountByStatus(User user, Approval_Status status) {
        Long count = expenseRepository.countByUserAndStatus(user, status);
        return count != null ? count : 0L;
    }

    public Expense getExpenseByIdAndUser(Long id, User user) {
        return expenseRepository.findByIdAndUser(id, user).orElse(null);
    }

    // ── approval (legacy + enhanced) ──────────────────────────────────────────

    @Transactional
    public Expense approveExpense(Long id, String role) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if ("MANAGER".equalsIgnoreCase(role)) {
            if (expense.getAmount() > 10_000) {
                throw new ApprovalNotAllowedException(
                        "Managers cannot approve expenses greater than ₹10,000. " +
                                "Use 'Forward to Admin' for amounts between ₹10,001–₹50,000.");
            }
        }

        expense.setStatus(Approval_Status.APPROVED);
        expense.setApprovalStage(role.toUpperCase());
        return expenseRepository.save(expense);
    }

    @Transactional
    public Expense rejectExpense(Long id, String role) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if ("MANAGER".equalsIgnoreCase(role)) {
            if (expense.getAmount() > 10_000) {
                throw new ApprovalNotAllowedException(
                        "Managers cannot reject expenses greater than ₹10,000. " +
                                "Use 'Forward to Admin' for amounts between ₹10,001–₹50,000.");
            }
        }

        expense.setStatus(Approval_Status.REJECTED);
        expense.setApprovalStage(role.toUpperCase());
        return expenseRepository.save(expense);
    }
}
