package com.ExpenseManagement.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ExpenseManagement.Entities.Expense;
import com.ExpenseManagement.Entities.Expense_Category;
import com.ExpenseManagement.Repository.ExpenseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImple implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    public List<Expense> getbymonthandyear(int month, int year) {
        return expenseRepository.findByMonthAndYear(month, year);

    }

    public List<Expense> getExpensesByCategory(Expense_Category category) {
        return expenseRepository.findByCategory(category);
    }

    public List<Expense> getallExpenses() {
        return expenseRepository.findAll();
    }

    public Expense getById(long id) {
        return expenseRepository.findById(id).orElse(null);
    }

    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public boolean deleteExpense(long id) {
        Optional<Expense> getexpense = expenseRepository.findById(id);
        if (getexpense.isPresent()) {
            expenseRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Expense updateById(long id, Expense expense) {
        Optional<Expense> result = expenseRepository.findById(id);
        if (result.isPresent()) {
            Expense expenseToUpdate = result.get();
            expenseToUpdate.setAmount(expense.getAmount());
            expenseToUpdate.setTitle(expense.getTitle());
            expenseToUpdate.setDate(expense.getDate());
            expenseToUpdate.setCategory(expense.getCategory());
            expenseToUpdate.setDate(expense.getDate());
            expenseToUpdate.setDescription(expense.getDescription());

            expenseRepository.save(expenseToUpdate);
            return expenseToUpdate;
        }
        return null;
    }

}
