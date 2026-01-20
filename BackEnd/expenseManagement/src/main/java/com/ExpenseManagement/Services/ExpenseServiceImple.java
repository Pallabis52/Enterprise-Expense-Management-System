package com.ExpenseManagement.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ExpenseManagement.Entities.Expense;
import com.ExpenseManagement.Repository.ExpenseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImple implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    public List<Expense> getbymonthandyear(int month, int year) {
        return expenseRepository.findByMonthAndYear(month, year);
    }

    // Changed to String to match Entity definition
    public List<Expense> getExpensesByCategory(String category) {
        return expenseRepository.findByCategory(category);
    }

    public List<Expense> getallExpenses() {
        return expenseRepository.findAll();
    }

    public Expense getById(long id) {
        return expenseRepository.findById(id).orElse(null);
    }

    @org.springframework.beans.factory.annotation.Autowired
    private com.ExpenseManagement.Notification.NotificationService notificationService;

    public Expense saveExpense(Expense expense) {
        if (expense == null) {
            throw new IllegalArgumentException("Expense cannot be null");
        }
        Expense saved = expenseRepository.save(expense);

        // Notify Manager if exists
        if (saved.getUser() != null && saved.getUser().getManager() != null) {
            com.ExpenseManagement.Entities.User manager = saved.getUser().getManager();
            notificationService.notifyUser(
                    manager.getId(),
                    "New Expense Submitted",
                    saved.getUser().getName() + " submitted a new expense: " + saved.getTitle(),
                    com.ExpenseManagement.Notification.Notification.NotificationType.INFO);
        }
        return saved;
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
            expenseToUpdate.setDescription(expense.getDescription());
            // Logic for receipt or user update if needed? Keeping simple as per request.

            return expenseRepository.save(expenseToUpdate);
        }
        return null;
    }

    // User Specific Implementations
    public org.springframework.data.domain.Page<Expense> getUserExpenses(com.ExpenseManagement.Entities.User user,
            org.springframework.data.domain.Pageable pageable) {
        return expenseRepository.findByUser(user, pageable);
    }

    public Double getUserTotalSpent(com.ExpenseManagement.Entities.User user) {
        Double total = expenseRepository.sumTotalAmountByUser(user);
        return total != null ? total : 0.0;
    }

    public Double getUserTotalByStatus(com.ExpenseManagement.Entities.User user,
            com.ExpenseManagement.Entities.Approval_Status status) {
        Double total = expenseRepository.sumAmountByUserAndStatus(user, status);
        return total != null ? total : 0.0;
    }

    public Long getUserCountByStatus(com.ExpenseManagement.Entities.User user,
            com.ExpenseManagement.Entities.Approval_Status status) {
        Long count = expenseRepository.countByUserAndStatus(user, status);
        return count != null ? count : 0L;
    }

}
