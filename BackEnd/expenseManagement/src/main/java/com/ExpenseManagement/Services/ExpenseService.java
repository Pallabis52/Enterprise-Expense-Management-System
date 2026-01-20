package com.ExpenseManagement.Services;

import java.util.List;

import com.ExpenseManagement.Entities.Expense;
import com.ExpenseManagement.Entities.Expense;

public interface ExpenseService {
    public List<Expense> getallExpenses();

    public Expense getById(long id);

    public Expense saveExpense(Expense expense);

    public boolean deleteExpense(long id);

    public Expense updateById(long id, Expense expense);

    public List<Expense> getExpensesByCategory(String category);

    public List<Expense> getbymonthandyear(int month, int year);

    // User Specific
    public org.springframework.data.domain.Page<Expense> getUserExpenses(com.ExpenseManagement.Entities.User user,
            org.springframework.data.domain.Pageable pageable);

    public Double getUserTotalSpent(com.ExpenseManagement.Entities.User user);

    public Double getUserTotalByStatus(com.ExpenseManagement.Entities.User user,
            com.ExpenseManagement.Entities.Approval_Status status);

    public Long getUserCountByStatus(com.ExpenseManagement.Entities.User user,
            com.ExpenseManagement.Entities.Approval_Status status);
}
