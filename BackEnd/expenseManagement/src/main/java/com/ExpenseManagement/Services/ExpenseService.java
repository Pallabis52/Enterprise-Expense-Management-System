package com.ExpenseManagement.Services;

import java.util.List;

import com.ExpenseManagement.Entities.Expense;
import com.ExpenseManagement.Entities.Expense_Category;

public interface ExpenseService {
    public List<Expense> getallExpenses();

    public Expense getById(long id);

    public Expense saveExpense(Expense expense);

    public boolean deleteExpense(long id);

    public Expense updateById(long id, Expense expense);

    public List<Expense> getExpensesByCategory(Expense_Category category);

    public List<Expense> getbymonthandyear(int month, int year);

}
