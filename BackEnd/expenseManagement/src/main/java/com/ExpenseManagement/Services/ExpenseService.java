package com.expensemanagement.services;

import java.util.List;

import com.expensemanagement.entities.Expense;
import com.expensemanagement.entities.Expense;

public interface ExpenseService {
        public List<Expense> getallExpenses();

        public Expense getById(long id);

        public Expense saveExpense(Expense expense);

        public boolean deleteExpense(long id);

        public Expense updateById(long id, Expense expense);

        public List<Expense> getExpensesByCategory(String category);

        public List<Expense> getbymonthandyear(int month, int year);

        // User Specific
        public org.springframework.data.domain.Page<Expense> getUserExpenses(com.expensemanagement.entities.User user,
                        org.springframework.data.domain.Pageable pageable);

        public Double getUserTotalSpent(com.expensemanagement.entities.User user);

        public Double getUserTotalByStatus(com.expensemanagement.entities.User user,
                        com.expensemanagement.entities.Approval_Status status);

        public Long getUserCountByStatus(com.expensemanagement.entities.User user,
                        com.expensemanagement.entities.Approval_Status status);

        public com.expensemanagement.entities.Expense getExpenseByIdAndUser(Long id,
                        com.expensemanagement.entities.User user);

        public com.expensemanagement.entities.Expense approveExpense(Long id, String role);

        public com.expensemanagement.entities.Expense rejectExpense(Long id, String role);

        public List<Expense> searchExpenses(String query, com.expensemanagement.entities.User user);

        public Expense saveDraft(Expense expense);

        public Expense submitDraft(Long id);
}
