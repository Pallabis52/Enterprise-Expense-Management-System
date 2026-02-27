package com.expensemanagement.controller;

import com.expensemanagement.entities.ExpensePolicy;
import com.expensemanagement.entities.FreezePeriod;
import com.expensemanagement.services.ExpensePolicyService;
import com.expensemanagement.services.FreezePeriodService;
import com.expensemanagement.services.TeamBudgetService;
import com.expensemanagement.entities.TeamBudget;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Expense policy, freeze period, and budget management — ADMIN only.
 * /api/policies/*
 * /api/freeze/*
 * /api/budgets/*
 */
@RestController
@RequiredArgsConstructor
public class ExpensePolicyController {

    private final ExpensePolicyService policyService;
    private final FreezePeriodService freezePeriodService;
    private final TeamBudgetService teamBudgetService;

    // ── Policies ─────────────────────────────────────────────────────────────

    /** GET /api/policies */
    @GetMapping("/api/policies")
    public ResponseEntity<List<ExpensePolicy>> getAllPolicies() {
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    /** GET /api/policies/active */
    @GetMapping("/api/policies/active")
    public ResponseEntity<List<ExpensePolicy>> getActivePolicies() {
        return ResponseEntity.ok(policyService.getActivePolicies());
    }

    /** POST /api/policies */
    @PostMapping("/api/policies")
    public ResponseEntity<ExpensePolicy> createPolicy(@RequestBody ExpensePolicy policy) {
        return ResponseEntity.ok(policyService.createPolicy(policy));
    }

    /** PUT /api/policies/{id} */
    @PutMapping("/api/policies/{id}")
    public ResponseEntity<ExpensePolicy> updatePolicy(
            @PathVariable Long id, @RequestBody ExpensePolicy policy) {
        return ResponseEntity.ok(policyService.updatePolicy(id, policy));
    }

    /** DELETE /api/policies/{id} */
    @DeleteMapping("/api/policies/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }

    // ── Freeze Periods ────────────────────────────────────────────────────────

    /** GET /api/freeze */
    @GetMapping("/api/freeze")
    public ResponseEntity<List<FreezePeriod>> allFreezePeriods() {
        return ResponseEntity.ok(freezePeriodService.getAllFreezePeriods());
    }

    /** GET /api/freeze/status */
    @GetMapping("/api/freeze/status")
    public ResponseEntity<Map<String, Boolean>> freezeStatus() {
        return ResponseEntity.ok(Map.of("frozen", freezePeriodService.isCurrentMonthFrozen()));
    }

    /**
     * POST /api/freeze/lock Body: { "month": 1, "year": 2025 } or lock current
     * month
     */
    @PostMapping("/api/freeze/lock")
    public ResponseEntity<FreezePeriod> lockMonth(@RequestBody(required = false) Map<String, Integer> body) {
        if (body != null && body.containsKey("month") && body.containsKey("year")) {
            return ResponseEntity.ok(freezePeriodService.lockMonth(body.get("month"), body.get("year")));
        }
        return ResponseEntity.ok(freezePeriodService.lockCurrentMonth());
    }

    /** POST /api/freeze/unlock Body: { "month": 1, "year": 2025 } */
    @PostMapping("/api/freeze/unlock")
    public ResponseEntity<Void> unlockMonth(@RequestBody Map<String, Integer> body) {
        freezePeriodService.unlockMonth(body.get("month"), body.get("year"));
        return ResponseEntity.ok().build();
    }

    // ── Team Budgets ──────────────────────────────────────────────────────────

    /** GET /api/budgets/{teamId}?month=1&year=2025 */
    @GetMapping("/api/budgets/{teamId}")
    public ResponseEntity<Map<String, Object>> getBudgetStatus(
            @PathVariable Long teamId,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        LocalDate now = LocalDate.now();
        int m = month != null ? month : now.getMonthValue();
        int y = year != null ? year : now.getYear();
        return ResponseEntity.ok(teamBudgetService.getBudgetStatus(teamId, m, y));
    }

    /** GET /api/budgets?month=1&year=2025 */
    @GetMapping("/api/budgets")
    public ResponseEntity<List<Map<String, Object>>> getAllBudgets(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        LocalDate now = LocalDate.now();
        int m = month != null ? month : now.getMonthValue();
        int y = year != null ? year : now.getYear();
        return ResponseEntity.ok(teamBudgetService.getAllBudgetStatuses(m, y));
    }

    /**
     * POST /api/budgets/{teamId} Body: { "month": 1, "year": 2025, "budget": 100000
     * }
     */
    @PostMapping("/api/budgets/{teamId}")
    public ResponseEntity<TeamBudget> setBudget(
            @PathVariable Long teamId,
            @RequestBody Map<String, Object> body) {
        int month = ((Number) body.get("month")).intValue();
        int year = ((Number) body.get("year")).intValue();
        double amt = ((Number) body.get("budget")).doubleValue();
        return ResponseEntity.ok(teamBudgetService.setBudget(teamId, month, year, amt));
    }
}
