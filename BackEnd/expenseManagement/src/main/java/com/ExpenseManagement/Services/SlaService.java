package com.expensemanagement.Services;

import com.expensemanagement.Entities.Approval_Status;
import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Notification.NotificationService;
import com.expensemanagement.Notification.Notification;
import com.expensemanagement.Repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SlaService {

    private final ExpenseRepository expenseRepository;
    private final NotificationService notificationService;

    private static final int SLA_HOURS = 48; // Configurable SLA window

    /**
     * Set SLA deadline when expense is submitted (called from ExpenseService).
     */
    public void assignSla(Expense expense) {
        try {
            expense.setSlaDeadAt(LocalDateTime.now().plusHours(SLA_HOURS));
            expense.setOverdue(false);
        } catch (Exception e) {
            log.error("Failed to assign SLA: {}", e.getMessage());
        }
    }

    /**
     * Scheduled job — runs every hour to flag overdue approvals.
     */
    @Scheduled(fixedRate = 3_600_000) // every 1 hour
    public void checkOverdueApprovals() {
        try {
            List<Expense> pending = expenseRepository.findByStatus(Approval_Status.PENDING);
            LocalDateTime now = LocalDateTime.now();
            for (Expense expense : pending) {
                if (expense.getSlaDeadAt() != null && !expense.isOverdue()
                        && now.isAfter(expense.getSlaDeadAt())) {
                    expense.setOverdue(true);
                    expenseRepository.save(expense);
                    // Notify manager
                    if (expense.getUser() != null) {
                        notificationService.notifyUser(
                                expense.getUser().getId(),
                                "SLA Breach — Action Required",
                                "Expense #" + expense.getId() + " (" + expense.getTitle()
                                        + ") is overdue for approval.",
                                Notification.NotificationType.WARNING,
                                Notification.NotificationCategory.SYSTEM);
                    }
                }
            }
            log.info("SLA check complete — checked {} pending expenses", pending.size());
        } catch (Exception e) {
            log.error("SLA check failed (non-blocking): {}", e.getMessage());
        }
    }

    public List<Expense> getOverdueExpenses() {
        try {
            return expenseRepository.findByStatus(Approval_Status.PENDING).stream()
                    .filter(Expense::isOverdue)
                    .toList();
        } catch (Exception e) {
            log.error("Failed to fetch overdue expenses: {}", e.getMessage());
            return List.of();
        }
    }
}
