package com.expensemanagement.services;

import com.expensemanagement.entities.Expense;
import com.expensemanagement.entities.ExpenseSplit;
import com.expensemanagement.entities.User;
import com.expensemanagement.repository.ExpenseSplitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExpenseSplitService {

    private final ExpenseSplitRepository expenseSplitRepository;

    @Transactional
    public List<ExpenseSplit> splitExpense(Expense expense, List<UserAmount> splits) {
        try {
            return splits.stream().map(s -> {
                ExpenseSplit split = ExpenseSplit.builder()
                        .expense(expense)
                        .splitWithUser(s.user())
                        .splitAmount(s.amount())
                        .status("PENDING")
                        .build();
                return expenseSplitRepository.save(split);
            }).toList();
        } catch (Exception e) {
            log.error("Failed to split expense: {}", e.getMessage());
            throw new RuntimeException("Expense split failed", e);
        }
    }

    public List<ExpenseSplit> getSplitsForExpense(Long expenseId) {
        return expenseSplitRepository.findByExpenseId(expenseId);
    }

    @Transactional
    public ExpenseSplit settleSplit(Long splitId) {
        ExpenseSplit split = expenseSplitRepository.findById(splitId)
                .orElseThrow(() -> new RuntimeException("Split not found"));
        split.setStatus("SETTLED");
        split.setSettledAt(java.time.LocalDateTime.now());
        return expenseSplitRepository.save(split);
    }

    public record UserAmount(User user, Double amount) {
    }
}
