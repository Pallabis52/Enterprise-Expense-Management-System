package com.expensemanagement.Services;

import java.util.List;

import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.Expense;

public interface ExpenseService {
        public List<Expense> getallExpenses();

        public Expense getById(long id);

        public Expense saveExpense(Expense expense);

        public boolean deleteExpense(long id);

        public Expense updateById(long id, Expense expense);

        public List<Expense> getExpensesByCategory(String category);

        public List<Expense> getbymonthandyear(int month, int year);

        // User Specific
        public org.springframework.data.domain.Page<Expense> getUserExpenses(com.expensemanagement.Entities.User user,
                        org.springframework.data.domain.Pageable pageable);

        public Double getUserTotalSpent(com.expensemanagement.Entities.User user);

        public Double getUserTotalByStatus(com.expensemanagement.Entities.User user,
                        com.expensemanagement.Entities.Approval_Status status);

        public Long getUserCountByStatus(com.expensemanagement.Entities.User user,
                        com.expensemanagement.Entities.Approval_Status status);

        public com.expensemanagement.Entities.Expense getExpenseByIdAndUser(Long id,
                        com.expensemanagement.Entities.User user);

        public com.expensemanagement.Entities.Expense approveExpense(Long id, String role);

        public com.expensemanagement.Entities.Expense rejectExpense(Long id, String role);

        public List<Expense> searchExpenses(String query, com.expensemanagement.Entities.User user);
}
