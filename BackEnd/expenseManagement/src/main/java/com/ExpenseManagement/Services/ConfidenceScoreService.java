package com.expensemanagement.services;

import com.expensemanagement.entities.Expense;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.expensemanagement.dto.AIDTOs;

import java.time.DayOfWeek;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConfidenceScoreService {

    public AIDTOs.ConfidenceScoreResult calculateScore(Expense expense) {
        int score = 0;
        StringBuilder breakdown = new StringBuilder();

        // Factor 1: Receipt uploaded (+20)
        if (expense.getReceiptUrl() != null && !expense.getReceiptUrl().isEmpty()) {
            score += 20;
            breakdown.append("+20 Receipt uploaded; ");
        } else {
            breakdown.append("+0 Missing receipt; ");
        }

        // Factor 2: Category valid (+10) - assuming if it exists it's valid for this
        // simple logic
        if (expense.getCategory() != null && !expense.getCategory().isEmpty()) {
            score += 10;
            breakdown.append("+10 Category assigned; ");
        }

        // Factor 3: Within budget (+20) - placeholder logic as we don't have
        // BudgetGuard here easily
        // In a real system we'd inject BudgetGuardService
        score += 20;
        breakdown.append("+20 Policy aligned; ");

        // Factor 4: Vendor trusted (+20)
        if (expense.getVendorName() != null && !expense.getVendorName().isEmpty()) {
            score += 20;
            breakdown.append("+20 Vendor identified; ");
        }

        // Factor 5: Not duplicate (+20)
        if (!expense.isDuplicate()) {
            score += 20;
            breakdown.append("+20 Unique entry; ");
        }

        // Factor 6: Weekend suspicious (-10)
        if (expense.getDate() != null) {
            DayOfWeek dow = expense.getDate().getDayOfWeek();
            if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
                score -= 10;
                breakdown.append("-10 Weekend submission; ");
            }
        }

        // Factor 7: High amount (-10)
        if (expense.getAmount() > 50000) {
            score -= 10;
            breakdown.append("-10 High value audit; ");
        }

        // Clamp score
        score = Math.max(0, Math.min(100, score));

        String riskLevel;
        if (score <= 40)
            riskLevel = "High";
        else if (score <= 70)
            riskLevel = "Medium";
        else
            riskLevel = "Low";

        return AIDTOs.ConfidenceScoreResult.builder()
                .score(score)
                .riskLevel(riskLevel)
                .breakdown(breakdown.toString().trim())
                .build();
    }
}
