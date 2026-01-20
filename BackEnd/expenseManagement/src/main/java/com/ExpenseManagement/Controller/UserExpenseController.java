package com.ExpenseManagement.Controller;

import com.ExpenseManagement.Entities.Approval_Status;
import com.ExpenseManagement.Entities.Expense;
import com.ExpenseManagement.Entities.User;
import com.ExpenseManagement.Services.ExpenseService;
import com.ExpenseManagement.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user/expenses")
@RequiredArgsConstructor
public class UserExpenseController {

    private final ExpenseService expenseService;
    private final UserService userService;

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        return userService.getUserByEmail(email);
    }

    @GetMapping
    public ResponseEntity<Page<Expense>> getMyExpenses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String status) {

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("date").descending());
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(expenseService.getUserExpenses(user, pageable));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getMyStats() {
        User user = getAuthenticatedUser();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSpent", expenseService.getUserTotalSpent(user));
        stats.put("pendingCount", expenseService.getUserCountByStatus(user, Approval_Status.PENDING));
        stats.put("approvedCount", expenseService.getUserCountByStatus(user, Approval_Status.APPROVED));
        stats.put("rejectedCount", expenseService.getUserCountByStatus(user, Approval_Status.REJECTED));

        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense) {
        User user = getAuthenticatedUser();
        expense.setUser(user);
        expense.setStatus(Approval_Status.PENDING);
        Expense saved = expenseService.saveExpense(expense);
        saved.setUser(null); // Prevent infinite recursion during serialization
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpense(@PathVariable Long id) {
        Expense expense = expenseService.getById(id);
        User user = getAuthenticatedUser();

        if (expense == null || !expense.getUser().getId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }
        expense.setUser(null); // Prevent infinite recursion
        return ResponseEntity.ok(expense);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        Expense existing = expenseService.getById(id);
        User user = getAuthenticatedUser();

        if (existing == null || !existing.getUser().getId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }

        expense.setUser(existing.getUser()); // Keep owner
        expense.setStatus(Approval_Status.PENDING); // Reset status on update
        Expense updated = expenseService.updateById(id, expense);
        if (updated != null)
            updated.setUser(null); // Prevent infinite recursion
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        Expense existing = expenseService.getById(id);
        User user = getAuthenticatedUser();

        if (existing == null || !existing.getUser().getId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }
        expenseService.deleteExpense(id);
        return ResponseEntity.ok().build();
    }
}
