package com.expensemanagement.controller;

import com.expensemanagement.entities.*;
import com.expensemanagement.services.*;
import com.expensemanagement.repository.ExpenseRepository;
import com.expensemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Handles all /api/admin/* endpoints for users with ADMIN role.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ExpenseService expenseService;
    private final TeamService teamService;
    private final UserService userService;
    private final ExpensePolicyService policyService;
    private final VendorAnalyticsService vendorAnalyticsService;
    private final FraudDetectionService fraudDetectionService;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    // ── Expense Management ──────────────────────────────────────────────────────

    /**
     * GET /api/admin/expenses?page=1&limit=10&status=PENDING
     */
    @GetMapping("/expenses")
    public ResponseEntity<Page<Expense>> getAllExpenses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Approval_Status status,
            Authentication auth) {
        PageRequest pageable = PageRequest.of(Math.max(0, page - 1), limit,
                Sort.by(Sort.Direction.DESC, "date"));
        Page<Expense> expenses;
        if (status != null) {
            expenses = expenseRepository.findByStatus(status, pageable);
        } else {
            expenses = expenseRepository.findAll(pageable);
        }
        return ResponseEntity.ok(expenses);
    }

    /**
     * GET /api/expenses/getbyid/{id} (used by both manager and admin frontend
     * services)
     */
    @GetMapping("/expenses/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        Expense expense = expenseService.getById(id);
        if (expense == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(expense);
    }

    /**
     * PUT /api/admin/expenses/{id}/approve
     */
    @PutMapping("/expenses/{id}/approve")
    public ResponseEntity<Expense> approveExpense(@PathVariable Long id) {
        Expense expense = expenseService.approveExpense(id, "ADMIN");
        return ResponseEntity.ok(expense);
    }

    /**
     * PUT /api/admin/expenses/{id}/reject
     */
    @PutMapping("/expenses/{id}/reject")
    public ResponseEntity<Expense> rejectExpense(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        Expense expense = expenseService.rejectExpense(id, "ADMIN");
        return ResponseEntity.ok(expense);
    }

    /**
     * DELETE /api/expenses/delete/{id} – shared with user-level delete
     */
    @DeleteMapping("/expenses/delete/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    // ── Users ───────────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/users?role=USER
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers(@RequestParam(required = false) Role role) {
        if (role != null) {
            return ResponseEntity.ok(userRepository.findByRole(role));
        }
        return ResponseEntity.ok(userRepository.findAll());
    }

    // ── Teams ───────────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/teams
     */
    @GetMapping("/teams")
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    /**
     * POST /api/admin/teams
     */
    @PostMapping("/teams")
    public ResponseEntity<Team> createTeam(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        Long managerId = body.containsKey("managerId") ? Long.valueOf(body.get("managerId").toString()) : null;
        Team team = teamService.createTeam(name, managerId);
        return ResponseEntity.ok(team);
    }

    /**
     * PUT /api/admin/teams/{teamId}/manager
     */
    @PutMapping("/teams/{teamId}/manager")
    public ResponseEntity<Team> assignManager(
            @PathVariable Long teamId,
            @RequestBody Map<String, Long> body) {
        Team team = teamService.assignManager(teamId, body.get("managerId"));
        return ResponseEntity.ok(team);
    }

    /**
     * PUT /api/admin/teams/{teamId}/members
     */
    @PutMapping("/teams/{teamId}/members")
    public ResponseEntity<Team> addMember(
            @PathVariable Long teamId,
            @RequestBody Map<String, Long> body) {
        Team team = teamService.addMember(teamId, body.get("userId"));
        return ResponseEntity.ok(team);
    }

    /**
     * DELETE /api/admin/teams/{teamId}/members/{userId}
     */
    @DeleteMapping("/teams/{teamId}/members/{userId}")
    public ResponseEntity<Team> removeMember(
            @PathVariable Long teamId,
            @PathVariable Long userId) {
        Team team = teamService.removeMember(teamId, userId);
        return ResponseEntity.ok(team);
    }

    // ── Policies ────────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/policies
     */
    @GetMapping("/policies")
    public ResponseEntity<List<ExpensePolicy>> getAllPolicies() {
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    /**
     * POST /api/admin/policies
     */
    @PostMapping("/policies")
    public ResponseEntity<ExpensePolicy> createPolicy(@RequestBody ExpensePolicy policy) {
        return ResponseEntity.ok(policyService.createPolicy(policy));
    }

    /**
     * PUT /api/admin/policies/{id}
     */
    @PutMapping("/policies/{id}")
    public ResponseEntity<ExpensePolicy> updatePolicy(
            @PathVariable Long id,
            @RequestBody ExpensePolicy policy) {
        return ResponseEntity.ok(policyService.updatePolicy(id, policy));
    }

    /**
     * DELETE /api/admin/policies/{id}
     */
    @DeleteMapping("/policies/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }

    // ── Reports ─────────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/reports/stats
     */
    @GetMapping("/reports/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long totalExpenses = expenseRepository.count();
        long pendingCount = expenseRepository.countByStatus(Approval_Status.PENDING);
        long approvedCount = expenseRepository.countByStatus(Approval_Status.APPROVED);
        long rejectedCount = expenseRepository.countByStatus(Approval_Status.REJECTED);
        Double totalSpend = expenseRepository.sumTotalAmount();
        long totalUsers = userRepository.count();
        long totalTeams = teamService.getTeamCount();

        return ResponseEntity.ok(Map.of(
                "totalExpenses", totalExpenses,
                "pendingCount", pendingCount,
                "approvedCount", approvedCount,
                "rejectedCount", rejectedCount,
                "totalSpend", totalSpend != null ? totalSpend : 0.0,
                "totalUsers", totalUsers,
                "totalTeams", totalTeams));
    }

    /**
     * GET /api/admin/reports/monthly?year=2024
     */
    @GetMapping("/reports/monthly")
    public ResponseEntity<List<Object[]>> getMonthlyExpenses(
            @RequestParam(defaultValue = "2024") int year) {
        return ResponseEntity.ok(expenseRepository.sumAmountByMonth(year));
    }

    /**
     * GET /api/admin/reports/category
     */
    @GetMapping("/reports/category")
    public ResponseEntity<List<Object[]>> getCategoryDistribution() {
        return ResponseEntity.ok(expenseRepository.sumAmountByCategory());
    }

    // ── Vendor & Fraud ──────────────────────────────────────────────────────────

    /**
     * GET /api/admin/vendors?suspicious=false
     */
    @GetMapping("/vendors")
    public ResponseEntity<?> getVendors(
            @RequestParam(defaultValue = "false") boolean suspicious) {
        if (suspicious) {
            return ResponseEntity.ok(vendorAnalyticsService.getSuspiciousVendors());
        }
        return ResponseEntity.ok(vendorAnalyticsService.getTopVendors());
    }

    /**
     * GET /api/admin/fraud-flags/{expenseId}
     */
    @GetMapping("/fraud-flags/{expenseId}")
    public ResponseEntity<?> getFraudFlags(@PathVariable Long expenseId) {
        Expense expense = expenseService.getById(expenseId);
        if (expense == null)
            return ResponseEntity.notFound().build();
        List<String> flags = fraudDetectionService.detectFraud(expense);
        return ResponseEntity.ok(Map.of("expenseId", expenseId, "flags", flags));
    }
}
