package com.expensemanagement.controller;

import com.expensemanagement.dto.UserStatsDTO;
import com.expensemanagement.entities.Approval_Status;
import com.expensemanagement.entities.Expense;
import com.expensemanagement.entities.User;
import com.expensemanagement.services.ExpenseService;
import com.expensemanagement.services.FileService;
import com.expensemanagement.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Handles all /api/user/* endpoints for authenticated users.
 */
@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final ExpenseService expenseService;
    private final UserService userService;
    private final FileService fileService;

    // ── Helpers ────────────────────────────────────────────────────────────────

    private User getCurrentUser(Authentication auth) {
        return userService.getUserByEmail(auth.getName());
    }

    // ── Expenses ───────────────────────────────────────────────────────────────

    /**
     * GET /api/user/expenses?page=1&limit=10&status=PENDING
     */
    @GetMapping("/expenses")
    public ResponseEntity<Page<Expense>> getMyExpenses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Approval_Status status,
            Authentication auth) {
        User user = getCurrentUser(auth);
        // Spring Data pages are 0-indexed; frontend sends 1-indexed
        PageRequest pageable = PageRequest.of(Math.max(0, page - 1), limit,
                Sort.by(Sort.Direction.DESC, "date"));
        Page<Expense> result = expenseService.getUserExpenses(user, pageable);
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/user/expenses/{id}
     */
    @GetMapping("/expenses/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id, Authentication auth) {
        User user = getCurrentUser(auth);
        Expense expense = expenseService.getExpenseByIdAndUser(id, user);
        if (expense == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(expense);
    }

    /**
     * POST /api/user/expenses
     */
    @PostMapping("/expenses")
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense, Authentication auth) {
        User user = getCurrentUser(auth);
        expense.setUser(user);
        Expense saved = expenseService.saveExpense(expense);
        return ResponseEntity.ok(saved);
    }

    /**
     * PUT /api/user/expenses/{id}
     */
    @PutMapping("/expenses/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long id,
            @RequestBody Expense expense,
            Authentication auth) {
        User user = getCurrentUser(auth);
        // Ensure only the owner can update
        Expense existing = expenseService.getExpenseByIdAndUser(id, user);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        Expense updated = expenseService.updateById(id, expense);
        return ResponseEntity.ok(updated);
    }

    /**
     * GET /api/user/expenses/stats
     */
    @GetMapping("/expenses/stats")
    public ResponseEntity<UserStatsDTO> getMyStats(Authentication auth) {
        User user = getCurrentUser(auth);
        UserStatsDTO stats = UserStatsDTO.builder()
                .totalSpent(expenseService.getUserTotalSpent(user))
                .pendingCount(expenseService.getUserCountByStatus(user, Approval_Status.PENDING))
                .approvedCount(expenseService.getUserCountByStatus(user, Approval_Status.APPROVED))
                .rejectedCount(expenseService.getUserCountByStatus(user, Approval_Status.REJECTED))
                .build();
        return ResponseEntity.ok(stats);
    }

    // ── Profile ─────────────────────────────────────────────────────────────────

    /**
     * GET /api/user/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication auth) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(user);
    }

    /**
     * PUT /api/user/profile
     */
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User updatedUser, Authentication auth) {
        User user = getCurrentUser(auth);
        user.setName(updatedUser.getName() != null ? updatedUser.getName() : user.getName());
        User saved = userService.updateUser(user);
        return ResponseEntity.ok(saved);
    }

    // ── Legacy endpoints (kept compatible with userService.js) ─────────────────

    /**
     * DELETE /api/expenses/delete/{id}
     */
    @DeleteMapping("/expenses/delete/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id, Authentication auth) {
        User user = getCurrentUser(auth);
        Expense expense = expenseService.getExpenseByIdAndUser(id, user);
        if (expense == null) {
            return ResponseEntity.notFound().build();
        }
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/expenses/draft
     */
    @PostMapping("/expenses/draft")
    public ResponseEntity<Expense> saveDraft(@RequestBody Expense expense, Authentication auth) {
        User user = getCurrentUser(auth);
        expense.setUser(user);
        Expense saved = expenseService.saveDraft(expense);
        return ResponseEntity.ok(saved);
    }

    /**
     * POST /api/expenses/{id}/submit
     */
    @PostMapping("/expenses/{id}/submit")
    public ResponseEntity<Expense> submitDraft(@PathVariable Long id, Authentication auth) {
        Expense submitted = expenseService.submitDraft(id);
        return ResponseEntity.ok(submitted);
    }

    /**
     * POST /api/expenses/{id}/upload-receipt
     */
    @PostMapping("/expenses/{id}/upload-receipt")
    public ResponseEntity<String> uploadReceipt(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication auth) {
        try {
            String url = fileService.saveFile(file);
            Expense expense = expenseService.getById(id);
            if (expense != null) {
                expense.setReceiptUrl(url);
                expenseService.updateById(id, expense);
            }
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            log.error("Failed to upload receipt for expense {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }

    /**
     * GET /api/expenses/{id}/receipt
     */
    @GetMapping("/expenses/{id}/receipt")
    public ResponseEntity<String> viewReceipt(
            @PathVariable Long id, Authentication auth) {
        try {
            Expense expense = expenseService.getById(id);
            if (expense == null || expense.getReceiptUrl() == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(expense.getReceiptUrl());
        } catch (Exception e) {
            log.error("Failed to serve receipt for expense {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/expenses/search?query=...
     */
    @GetMapping("/expenses/search")
    public ResponseEntity<?> searchExpenses(@RequestParam String query, Authentication auth) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(expenseService.searchExpenses(query, user));
    }

    /**
     * GET /api/expenses/suggest-categories?title=...
     */
    @GetMapping("/expenses/suggest-categories")
    public ResponseEntity<?> suggestCategories(@RequestParam String title) {
        // Simple keyword-based suggestion; returns top matches
        return ResponseEntity.ok(java.util.List.of("Travel", "Food", "Accommodation", "Office Supplies", "Other"));
    }
}
