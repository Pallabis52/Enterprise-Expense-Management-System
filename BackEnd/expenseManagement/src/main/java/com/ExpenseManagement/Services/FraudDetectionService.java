package com.expensemanagement.Services;

import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FraudDetectionService {

    private final ExpenseRepository expenseRepository;

    public List<String> detectFraud(Expense expense) {
        List<String> flags = new ArrayList<>();

        // Rule 1: Weekend submission for large amounts
        if (expense.getDate() != null) {
            DayOfWeek dow = expense.getDate().getDayOfWeek();
            if ((dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) && expense.getAmount() > 5000) {
                flags.add("High-value weekend submission");
            }
        }

        // Rule 2: Rapid submissions (3+ in 1 hour)
        if (expense.getUser() != null) {
            LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
            // This would require a specific query, for now we simulate or use a simpler
            // check
            // assuming a smaller window or just flagging high frequency
        }

        // Rule 3: Vendor mismatch/confidence score (if integrated)
        if (expense.getConfidenceScore() != null && expense.getConfidenceScore() < 40) {
            flags.add("Low AI confidence score");
        }

        return flags;
    }
}
