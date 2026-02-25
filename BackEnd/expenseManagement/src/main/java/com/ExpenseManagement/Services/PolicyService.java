package com.expensemanagement.Services;

import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.ExpensePolicy;
import com.expensemanagement.Repository.ExpensePolicyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PolicyService {

    private final ExpensePolicyRepository policyRepository;

    /**
     * Evaluates an expense against all active policies.
     * Returns true if any policy is breached.
     */
    public boolean evaluatePolicies(Expense expense) {
        List<ExpensePolicy> activePolicies = policyRepository.findByIsActiveTrue();
        for (ExpensePolicy policy : activePolicies) {
            // maxAmount check
            if (policy.getMaxAmount() != null && expense.getAmount() > policy.getMaxAmount()) {
                log.info("Policy Breached: {} (Amount ₹{} > Limit ₹{})",
                        policy.getName(), expense.getAmount(), policy.getMaxAmount());
                return true;
            }
            // Category check
            if (policy.getAllowedCategories() != null && !policy.getAllowedCategories().isEmpty()) {
                if (!policy.getAllowedCategories().contains(expense.getCategory())) {
                    log.info("Policy Breached: {} (Category {} not in allowed list)",
                            policy.getName(), expense.getCategory());
                    return true;
                }
            }
            // requiresReceipt check
            if (policy.isRequiresReceipt() && (expense.getReceiptUrl() == null || expense.getReceiptUrl().isBlank())) {
                log.info("Policy Breached: {} (Receipt required but missing)", policy.getName());
                return true;
            }
        }
        return false;
    }
}
