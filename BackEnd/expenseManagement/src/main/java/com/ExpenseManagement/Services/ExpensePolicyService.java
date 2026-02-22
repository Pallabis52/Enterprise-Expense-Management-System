package com.expensemanagement.Services;

import com.expensemanagement.Entities.ExpensePolicy;
import com.expensemanagement.Repository.ExpensePolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpensePolicyService {

    private final ExpensePolicyRepository policyRepository;

    public List<ExpensePolicy> getAllPolicies() {
        return policyRepository.findAll();
    }

    public List<ExpensePolicy> getActivePolicies() {
        return policyRepository.findByIsActiveTrue();
    }

    @org.springframework.beans.factory.annotation.Autowired
    private com.expensemanagement.Notification.NotificationService notificationService;

    public ExpensePolicy createPolicy(ExpensePolicy policy) {
        ExpensePolicy saved = policyRepository.save(policy);
        notificationService.notifyRole(
                com.expensemanagement.Entities.Role.MANAGER,
                "New Policy Created",
                "A new expense policy '" + saved.getName() + "' has been created.",
                com.expensemanagement.Notification.Notification.NotificationType.INFO,
                com.expensemanagement.Notification.Notification.NotificationCategory.POLICY);
        return saved;
    }

    public ExpensePolicy updatePolicy(Long id, ExpensePolicy updatedPolicy) {
        return policyRepository.findById(id).map(policy -> {
            policy.setName(updatedPolicy.getName());
            policy.setDescription(updatedPolicy.getDescription());
            policy.setMaxAmount(updatedPolicy.getMaxAmount());
            policy.setMonthlyLimit(updatedPolicy.getMonthlyLimit());
            policy.setRequiresReceipt(updatedPolicy.isRequiresReceipt());
            policy.setActive(updatedPolicy.isActive());
            policy.setAllowedCategories(updatedPolicy.getAllowedCategories());
            return policyRepository.save(policy);
        }).orElseThrow(() -> new RuntimeException("Policy not found"));
    }

    public void deletePolicy(Long id) {
        policyRepository.deleteById(id);
    }
}
