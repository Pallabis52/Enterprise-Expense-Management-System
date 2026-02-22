package com.expensemanagement.Services;

import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Detects duplicate expenses at submission time (Feature 6).
 * Duplicate criteria: same user + same amount + same date + same description.
 * The expense is NOT blocked — it is flagged with isDuplicate=true.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DuplicateDetectionService {

    private final ExpenseRepository expenseRepository;

    /**
     * Checks if an existing expense matches on (user, amount, date, description).
     *
     * @param expense The expense to check (not yet persisted)
     * @return true if a duplicate exists
     */
    public boolean isDuplicate(Expense expense) {
        if (expense.getUser() == null || expense.getDate() == null || expense.getDescription() == null) {
            return false;
        }
        boolean found = expenseRepository.existsByUserAndAmountAndDateAndDescription(
                expense.getUser(),
                expense.getAmount(),
                expense.getDate(),
                expense.getDescription());
        if (found) {
            log.warn("Duplicate expense detected for user={} amount={} date={} desc={}",
                    expense.getUser().getId(), expense.getAmount(), expense.getDate(), expense.getDescription());
        }
        return found;
    }
}
