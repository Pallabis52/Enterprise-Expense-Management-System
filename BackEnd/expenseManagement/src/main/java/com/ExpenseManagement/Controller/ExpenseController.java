package com.expensemanagement.controller;

import com.expensemanagement.entities.Expense;
import com.expensemanagement.services.ExpenseService;
import com.expensemanagement.services.UserService;
import com.expensemanagement.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Legacy expense routes used across multiple frontend services.
 * These paths do NOT include a role prefix (e.g. /user, /manager, /admin)
 * and are accessible to all authenticated roles.
 */
@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserService userService;

    /**
     * GET /api/expenses/getbyid/{id}
     * Used by both managerService.js and adminExpenseService.js
     */
    @GetMapping("/getbyid/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        Expense expense = expenseService.getById(id);
        if (expense == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(expense);
    }

    /**
     * DELETE /api/expenses/delete/{id}
     * Used by adminExpenseService.js
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id, Authentication auth) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/expenses/search?query=...
     */
    @GetMapping("/search")
    public ResponseEntity<List<Expense>> searchExpenses(
            @RequestParam String query, Authentication auth) {
        User user = userService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(expenseService.searchExpenses(query, user));
    }

    /**
     * GET /api/expenses/suggest-categories?title=...
     */
    @GetMapping("/suggest-categories")
    public ResponseEntity<List<String>> suggestCategories(@RequestParam String title) {
        return ResponseEntity.ok(List.of("Travel", "Food", "Accommodation", "Office Supplies",
                "Transport", "Utilities", "Entertainment", "Other"));
    }

    /**
     * POST /api/expenses/draft
     */
    @PostMapping("/draft")
    public ResponseEntity<Expense> saveDraft(@RequestBody Expense expense, Authentication auth) {
        User user = userService.getUserByEmail(auth.getName());
        expense.setUser(user);
        return ResponseEntity.ok(expenseService.saveDraft(expense));
    }

    /**
     * POST /api/expenses/{id}/submit
     */
    @PostMapping("/{id}/submit")
    public ResponseEntity<Expense> submitDraft(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.submitDraft(id));
    }
}
