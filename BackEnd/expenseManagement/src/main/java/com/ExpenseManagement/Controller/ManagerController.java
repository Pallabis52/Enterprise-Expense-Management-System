package com.expensemanagement.controller;

import com.expensemanagement.entities.Approval_Status;
import com.expensemanagement.entities.Expense;
import com.expensemanagement.entities.Team;
import com.expensemanagement.entities.User;
import com.expensemanagement.entities.ExpensePolicy;
import com.expensemanagement.services.ManagerService;
import com.expensemanagement.services.UserService;
import com.expensemanagement.services.ExpensePolicyService;
import com.expensemanagement.services.PerformanceService;
import com.expensemanagement.services.ExpenseService;
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
 * Handles all /api/manager/* endpoints for users with MANAGER role.
 */
@Slf4j
@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;
    private final UserService userService;
    private final ExpensePolicyService policyService;
    private final PerformanceService performanceService;
    private final ExpenseService expenseService;

    private User getCurrentManager(Authentication auth) {
        return userService.getUserByEmail(auth.getName());
    }

    // ── Team Expenses ───────────────────────────────────────────────────────────

    /**
     * GET /api/manager/team/expenses?page=1&limit=10&status=PENDING
     */
    @GetMapping("/team/expenses")
    public ResponseEntity<Page<Expense>> getTeamExpenses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Approval_Status status,
            Authentication auth) {
        User manager = getCurrentManager(auth);
        PageRequest pageable = PageRequest.of(Math.max(0, page - 1), limit,
                Sort.by(Sort.Direction.DESC, "date"));
        Page<Expense> expenses = managerService.getTeamExpenses(manager.getId(), status, pageable);
        return ResponseEntity.ok(expenses);
    }

    /**
     * PUT /api/manager/expenses/{id}/approve
     */
    @PutMapping("/expenses/{id}/approve")
    public ResponseEntity<Expense> approveExpense(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            Authentication auth) {
        User manager = getCurrentManager(auth);
        Expense expense = managerService.approveExpense(id, manager.getId());
        return ResponseEntity.ok(expense);
    }

    /**
     * PUT /api/manager/expenses/{id}/reject
     */
    @PutMapping("/expenses/{id}/reject")
    public ResponseEntity<Expense> rejectExpense(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        String reason = body.getOrDefault("reason", "Rejected by manager");
        Expense expense = managerService.rejectExpense(id, reason);
        return ResponseEntity.ok(expense);
    }

    /**
     * PUT /api/manager/expenses/{id}/forward
     */
    @PutMapping("/expenses/{id}/forward")
    public ResponseEntity<Expense> forwardToAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        User manager = getCurrentManager(auth);
        String comment = body.getOrDefault("comment", "Forwarded to admin for review");
        Expense expense = managerService.forwardToAdmin(id, manager.getId(), comment);
        return ResponseEntity.ok(expense);
    }

    /**
     * POST /api/manager/expenses/bulk-approve
     */
    @PostMapping("/expenses/bulk-approve")
    public ResponseEntity<Map<String, Object>> bulkApprove(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        User manager = getCurrentManager(auth);
        @SuppressWarnings("unchecked")
        List<Long> expenseIds = (List<Long>) body.get("expenseIds");
        String comment = (String) body.getOrDefault("comment", "Bulk approved");
        Map<String, Object> result = managerService.bulkApprove(expenseIds, manager.getId(), comment);
        return ResponseEntity.ok(result);
    }

    // ── Team Info ───────────────────────────────────────────────────────────────

    /**
     * GET /api/manager/team
     */
    @GetMapping("/team")
    public ResponseEntity<Team> getTeam(Authentication auth) {
        User manager = getCurrentManager(auth);
        Team team = managerService.getTeam(manager.getId());
        if (team == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(team);
    }

    /**
     * GET /api/manager/team/members
     */
    @GetMapping("/team/members")
    public ResponseEntity<List<User>> getTeamMembers(Authentication auth) {
        User manager = getCurrentManager(auth);
        List<User> members = managerService.getTeamMembers(manager.getId());
        return ResponseEntity.ok(members);
    }

    /**
     * GET /api/manager/team/performance
     */
    @GetMapping("/team/performance")
    public ResponseEntity<?> getTeamPerformance(Authentication auth) {
        User manager = getCurrentManager(auth);
        return ResponseEntity.ok(performanceService.getTeamPerformance(manager.getId()));
    }

    /**
     * GET /api/manager/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(Authentication auth) {
        User manager = getCurrentManager(auth);
        Map<String, Object> dashboard = managerService.getManagerDashboard(manager.getId());
        return ResponseEntity.ok(dashboard);
    }

    /**
     * GET /api/expenses/getbyid/{id} – used by manager & admin frontend services
     */
    @GetMapping("/api/expenses/getbyid/{id}")
    @org.springframework.web.bind.annotation.ResponseBody
    public ResponseEntity<Expense> getExpenseByIdLegacy(@PathVariable Long id) {
        Expense expense = expenseService.getById(id);
        if (expense == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(expense);
    }

    // ── Policies ────────────────────────────────────────────────────────────────

    /**
     * GET /api/manager/policies
     */
    @GetMapping("/policies")
    public ResponseEntity<List<ExpensePolicy>> getActivePolicies() {
        return ResponseEntity.ok(policyService.getActivePolicies());
    }

    /**
     * POST /api/manager/policies
     */
    @PostMapping("/policies")
    public ResponseEntity<ExpensePolicy> createPolicy(@RequestBody ExpensePolicy policy, Authentication auth) {
        return ResponseEntity.ok(policyService.createPolicy(policy));
    }
}
