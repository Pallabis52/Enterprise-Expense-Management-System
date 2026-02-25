package com.expensemanagement.Services;

import java.util.List;
import java.util.Optional;
import com.expensemanagement.DTO.AIDTOs;

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
import com.expensemanagement.Repository.ExpenseSplitRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExpenseServiceImple implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final NotificationService notificationService;
    private final CategoryResolver categoryResolver;
    private final DuplicateDetectionService duplicateDetectionService;
    private final FreezePeriodService freezePeriodService;
    private final AuditLogService auditLogService;
    private final SlaService slaService;
    private final BudgetGuardService budgetGuardService;
    private final CategorySuggestionService categorySuggestionService;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final PolicyService policyService;
    private final VendorAnalyticsService vendorAnalyticsService;
    private final ConfidenceScoreService confidenceScoreService;

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

    // ── save (Feature 4, 5, 6, 9, 17, 19)
    // ─────────────────────────────────────────────

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

        // Setup for submitted expenses
        if (expense.getStatus() == null || expense.getStatus() == Approval_Status.DRAFT) {
            expense.setStatus(Approval_Status.PENDING);
            expense.setDraft(false);
        }

        // Feature 19: Assign SLA on submission
        slaService.assignSla(expense);

        // Feature 1: Budget Guard (Warning only, non-blocking)
        if (expense.getUser() != null) {
            BudgetGuardService.BudgetWarning warning = budgetGuardService.checkBudget(expense.getUser(),
                    expense.getAmount());
            if (warning != null && warning.exceeded()) {
                log.warn("Budget Exceeded (₹{} > ₹{}) for user: {}",
                        warning.currentSpend() + expense.getAmount(), warning.limit(), expense.getUser().getName());
            }
        }

        // Feature 5: Auto-categorize if category is blank
        if (expense.getCategory() == null || expense.getCategory().isBlank()) {
            expense.setCategory(categoryResolver.resolve(expense.getTitle(), expense.getDescription()));
            log.info("Auto-categorized expense to: {}", expense.getCategory());
        }

        // Feature 6: Duplicate detection (flag, do not block)
        if (expense.getUser() != null) {
            AIDTOs.DuplicateDetectionResult dupResult = duplicateDetectionService
                    .detectDuplicate(expense, expense.getUser()).join();
            if ("yes".equalsIgnoreCase(dupResult.getDuplicate())) {
                expense.setDuplicate(true);
                log.info("AI detected possible duplicate: {}", dupResult.getReason());
            }
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

        // Feature 17: Audit Log
        auditLogService.log("EXPENSE", saved.getId(), "SUBMITTED",
                saved.getUser() != null ? saved.getUser().getName() : "SYSTEM",
                saved.getUser() != null ? saved.getUser().getRole().name() : "USER",
                "Expense amount: " + saved.getAmount());

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

        // Feature 10: Policy Evaluation (Directly affects stage)
        if (policyService.evaluatePolicies(expense)) {
            saved.setApprovalStage("ADMIN"); // Escalation
            expenseRepository.save(saved);
            log.info("Expense #{} escalated to ADMIN due to policy breach", saved.getId());
        }

        // Feature 11: Vendor Analytics
        vendorAnalyticsService.updateVendorStats(saved);

        // Feature 16: Confidence Score
        saved.setConfidenceScore(confidenceScoreService.calculate(saved));
        expenseRepository.save(saved);

        return saved;
    }

    // Feature 4: Save as Draft
    @Override
    public Expense saveDraft(Expense expense) {
        expense.setStatus(Approval_Status.DRAFT);
        expense.setDraft(true);
        Expense saved = expenseRepository.save(expense);

        auditLogService.log("EXPENSE", saved.getId(), "DRAFT_SAVED",
                saved.getUser() != null ? saved.getUser().getName() : "SYSTEM",
                "USER", "Draft payload saved");
        return saved;
    }

    // Feature 4: Submit Draft
    @Override
    @Transactional
    public Expense submitDraft(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Draft not found"));
        if (expense.getStatus() != Approval_Status.DRAFT) {
            throw new IllegalStateException("Only drafts can be submitted");
        }
        return saveExpense(expense);
    }

    // ── crud ──────────────────────────────────────────────────────────────────

    public boolean deleteExpense(long id) {
        Optional<Expense> getexpense = expenseRepository.findById(id);
        if (getexpense.isPresent()) {
            expenseRepository.deleteById(id);
            auditLogService.log("EXPENSE", id, "DELETED", "UNKNOWN", "ADMIN", "Soft delete simulated");
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
            if (expense.getReceiptUrl() != null) {
                expenseToUpdate.setReceiptUrl(expense.getReceiptUrl());
            }
            Expense updated = expenseRepository.save(expenseToUpdate);
            auditLogService.log("EXPENSE", id, "UPDATED", "OWNER", "USER", "Fields modified");
            return updated;
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
        Expense saved = expenseRepository.save(expense);

        auditLogService.log("EXPENSE", id, "APPROVED", "APPROVER", role, "Approved at stage: " + role);
        return saved;
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
        Expense saved = expenseRepository.save(expense);

        auditLogService.log("EXPENSE", id, "REJECTED", "APPROVER", role, "Rejected at stage: " + role);
        return saved;
    }

    @Override
    public List<Expense> searchExpenses(String query, User user) {
        if (user.getRole() == Role.ADMIN) {
            return expenseRepository.searchByKeyword(query);
        } else if (user.getRole() == Role.MANAGER) {
            // Include manager's own expenses and those of their team members
            if (user.getTeam() != null) {
                return expenseRepository.searchByKeywordAndUsers(query, user.getTeam().getMembers(), user);
            }
            return expenseRepository.searchByKeywordAndUser(query, user);
        } else {
            return expenseRepository.searchByKeywordAndUser(query, user);
        }
    }
}
