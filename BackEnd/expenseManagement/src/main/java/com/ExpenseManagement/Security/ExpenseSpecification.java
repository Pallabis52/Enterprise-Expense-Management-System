package com.expensemanagement.Security;

import com.expensemanagement.DTO.AIDTOs;
import com.expensemanagement.Entities.Approval_Status;
import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.User;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class ExpenseSpecification {

    public static Specification<Expense> filterBy(AIDTOs.SearchFilters filters, User user) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always scope to the user
            predicates.add(cb.equal(root.get("user"), user));

            if (filters.getStatus() != null && !filters.getStatus().isEmpty()) {
                try {
                    Approval_Status status = Approval_Status.valueOf(filters.getStatus().toUpperCase());
                    predicates.add(cb.equal(root.get("status"), status));
                } catch (IllegalArgumentException ignored) {
                }
            }

            if (filters.getCategory() != null && !filters.getCategory().isEmpty()) {
                predicates
                        .add(cb.like(cb.lower(root.get("category")), "%" + filters.getCategory().toLowerCase() + "%"));
            }

            if (filters.getMinAmount() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("amount"), filters.getMinAmount()));
            }

            if (filters.getMonth() != null && !filters.getMonth().isEmpty()) {
                // Assuming month is something like "January" or "01"
                // For simplicity, let's use a basic like or extra logic if needed.
                // In a production app, we'd parse this to a date range.
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
