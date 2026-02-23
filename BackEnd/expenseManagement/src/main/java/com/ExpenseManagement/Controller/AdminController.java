package com.expensemanagement.Controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.expensemanagement.DTO.AdminStatsDTO;
import com.expensemanagement.Entities.Approval_Status;
import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.FreezePeriod;
import com.expensemanagement.Entities.Role;
import com.expensemanagement.Entities.Team;
import com.expensemanagement.Entities.TeamBudget;
import com.expensemanagement.Entities.User;
import com.expensemanagement.Repository.ExpenseRepository;
import com.expensemanagement.Repository.UserRepository;
import com.expensemanagement.Services.FreezePeriodService;
import com.expensemanagement.Services.TeamBudgetService;
import com.expensemanagement.Services.TeamService;
import com.expensemanagement.AI.AIResponse;
import com.expensemanagement.AI.AIService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminController {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final TeamService teamService;
    private final TeamBudgetService teamBudgetService;
    private final FreezePeriodService freezePeriodService;
    private final AIService aiService;

    // ── Team Management ───────────────────────────────────────────────────────

    @PostMapping("/teams")
    public ResponseEntity<Team> createTeam(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        Long managerId = Long.valueOf(body.get("managerId").toString());
        return ResponseEntity.ok(teamService.createTeam(name, managerId));
    }

    @PutMapping("/teams/{teamId}/manager")
    public ResponseEntity<Team> assignManager(@PathVariable Long teamId, @RequestBody Map<String, Long> body) {
        Long managerId = body.get("managerId");
        return ResponseEntity.ok(teamService.assignManager(teamId, managerId));
    }

    @PutMapping("/teams/{teamId}/members")
    public ResponseEntity<Team> addMember(@PathVariable Long teamId, @RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        return ResponseEntity.ok(teamService.addMember(teamId, userId));
    }

    @GetMapping("/teams")
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsersByRole(@RequestParam(required = false) Role role) {
        if (role != null) {
            return ResponseEntity.ok(userRepository.findByRole(role));
        }
        return ResponseEntity.ok(userRepository.findAll());
    }

    // ── Global Expense Oversight ──────────────────────────────────────────────

    @GetMapping("/expenses")
    public ResponseEntity<Page<Expense>> getAllExpenses(
            @RequestParam(required = false) Approval_Status status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {

        log.info("Fetching all expenses for admin. Page: {}, Limit: {}, Status: {}", page, limit, status);
        Pageable pageable = PageRequest.of(page - 1, limit);
        if (status != null) {
            return ResponseEntity.ok(expenseRepository.findByStatus(status, pageable));
        }
        return ResponseEntity.ok(expenseRepository.findAll(pageable));
    }

    /** Feature 1: Admin views all forwarded-to-admin expenses */
    @GetMapping("/expenses/forwarded")
    public ResponseEntity<Page<Expense>> getForwardedExpenses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(expenseRepository.findByStatusIn(
                List.of(Approval_Status.FORWARDED_TO_ADMIN), pageable));
    }

    /** Feature 1 & 8: Admin approves with optional comment */
    @PutMapping("/expenses/{id}/approve")
    public ResponseEntity<Expense> approveExpense(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        expense.setStatus(Approval_Status.APPROVED);
        expense.setApprovalStage("ADMIN");
        if (body != null && body.containsKey("approvalComment")) {
            expense.setApprovalComment(body.get("approvalComment"));
        }
        Expense saved = expenseRepository.save(expense);
        // Notify user
        notifyUser(saved, "approved");
        return ResponseEntity.ok(saved);
    }

    /** Feature 1 & 8: Admin rejects with rejection reason and optional comment */
    @PutMapping("/expenses/{id}/reject")
    public ResponseEntity<Expense> rejectExpense(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        expense.setStatus(Approval_Status.REJECTED);
        expense.setApprovalStage("ADMIN");
        if (body != null) {
            String reason = body.getOrDefault("reason", "Rejected by admin");
            expense.setRejectionReason(reason);
            expense.setApprovalComment(body.getOrDefault("approvalComment", reason));
        }
        Expense saved = expenseRepository.save(expense);
        notifyUser(saved, "rejected");
        return ResponseEntity.ok(saved);
    }

    // ── Existing Reports ──────────────────────────────────────────────────────

    @GetMapping("/reports/stats")
    public ResponseEntity<AdminStatsDTO> getAdminStats() {
        Double total = expenseRepository.sumTotalAmount();
        Long approved = expenseRepository.countByStatus(Approval_Status.APPROVED);
        Long rejected = expenseRepository.countByStatus(Approval_Status.REJECTED);
        Long pending = expenseRepository.countByStatus(Approval_Status.PENDING);
        Long categories = expenseRepository.countDistinctCategories();

        Double totalSpent = total != null ? total : 0.0;
        Double avgMonthly = totalSpent / 12;

        return ResponseEntity.ok(AdminStatsDTO.builder()
                .totalSpent(totalSpent)
                .avgMonthlySpend(avgMonthly)
                .categoryCount(categories != null ? categories : 0L)
                .userCount(userRepository.count())
                .teamCount(teamService.getTeamCount())
                .pendingCount(pending != null ? pending : 0L)
                .approvedCount(approved != null ? approved : 0L)
                .rejectedCount(rejected != null ? rejected : 0L)
                .build());
    }

    @GetMapping("/reports/monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyExpenses(
            @RequestParam(defaultValue = "2024") int year) {
        List<Object[]> results = expenseRepository.sumAmountByMonth(year);
        List<Map<String, Object>> response = new ArrayList<>();
        String[] months = { "", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
        for (Object[] row : results) {
            Map<String, Object> item = new HashMap<>();
            int monthIndex = row[0] instanceof Number ? ((Number) row[0]).intValue() : 0;
            Double amount = row[1] instanceof Number ? ((Number) row[1]).doubleValue() : 0.0;
            if (monthIndex >= 1 && monthIndex <= 12) {
                item.put("month", months[monthIndex]);
                item.put("amount", amount);
                response.add(item);
            }
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reports/category")
    public ResponseEntity<List<Map<String, Object>>> getCategoryDistribution() {
        List<Object[]> results = expenseRepository.sumAmountByCategory();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", (String) row[0]);
            item.put("value", row[1] instanceof Number ? ((Number) row[1]).doubleValue() : 0.0);
            response.add(item);
        }
        return ResponseEntity.ok(response);
    }

    // ── Feature 3: Budget Management ─────────────────────────────────────────

    @PostMapping("/budgets")
    public ResponseEntity<TeamBudget> setBudget(@RequestBody Map<String, Object> body) {
        Long teamId = Long.valueOf(body.get("teamId").toString());
        int month = Integer.parseInt(body.get("month").toString());
        int year = Integer.parseInt(body.get("year").toString());
        Double amount = Double.valueOf(body.get("budgetAmount").toString());
        return ResponseEntity.ok(teamBudgetService.setBudget(teamId, month, year, amount));
    }

    @GetMapping("/budgets")
    public ResponseEntity<List<Map<String, Object>>> getAllBudgets(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        LocalDate now = LocalDate.now();
        int m = month != null ? month : now.getMonthValue();
        int y = year != null ? year : now.getYear();
        return ResponseEntity.ok(teamBudgetService.getAllBudgetStatuses(m, y));
    }

    @GetMapping("/budgets/team/{teamId}")
    public ResponseEntity<Map<String, Object>> getTeamBudget(
            @PathVariable Long teamId,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        LocalDate now = LocalDate.now();
        int m = month != null ? month : now.getMonthValue();
        int y = year != null ? year : now.getYear();
        return ResponseEntity.ok(teamBudgetService.getBudgetStatus(teamId, m, y));
    }

    // ── Feature 4: Freeze Period Management ──────────────────────────────────

    @PostMapping("/freeze")
    public ResponseEntity<FreezePeriod> lockMonth(@RequestBody(required = false) Map<String, Object> body) {
        if (body != null && body.containsKey("month") && body.containsKey("year")) {
            int month = Integer.parseInt(body.get("month").toString());
            int year = Integer.parseInt(body.get("year").toString());
            return ResponseEntity.ok(freezePeriodService.lockMonth(month, year));
        }
        return ResponseEntity.ok(freezePeriodService.lockCurrentMonth());
    }

    @DeleteMapping("/freeze/{month}/{year}")
    public ResponseEntity<Void> unlockMonth(@PathVariable int month, @PathVariable int year) {
        freezePeriodService.unlockMonth(month, year);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/freeze/status")
    public ResponseEntity<Map<String, Object>> getFreezeStatus() {
        LocalDate now = LocalDate.now();
        Map<String, Object> status = new HashMap<>();
        status.put("frozen", freezePeriodService.isCurrentMonthFrozen());
        status.put("month", now.getMonthValue());
        status.put("year", now.getYear());
        status.put("periods", freezePeriodService.getAllFreezePeriods());
        return ResponseEntity.ok(status);
    }

    // ── Feature 7: Advanced Admin Dashboard ───────────────────────────────────

    @GetMapping("/dashboard/advanced")
    public ResponseEntity<Map<String, Object>> getAdvancedDashboard() {
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        // Total company spend
        Double totalSpend = expenseRepository.sumTotalAmount();

        // Pending count
        Long pending = expenseRepository.countByStatus(Approval_Status.PENDING);
        Long forwarded = expenseRepository.countByStatus(Approval_Status.FORWARDED_TO_ADMIN);

        // Top teams by spending this month
        List<Object[]> topTeamsRaw = expenseRepository.findTopTeamsByMonth(month, year);
        List<Map<String, Object>> topTeams = new ArrayList<>();
        for (Object[] row : topTeamsRaw) {
            Map<String, Object> t = new HashMap<>();
            t.put("teamName", row[0]);
            t.put("spent", row[1] instanceof Number ? ((Number) row[1]).doubleValue() : 0.0);
            topTeams.add(t);
        }

        // Budget alerts (exceeded teams)
        List<Map<String, Object>> allBudgets = teamBudgetService.getAllBudgetStatuses(month, year);
        List<Map<String, Object>> budgetAlerts = allBudgets.stream()
                .filter(b -> Boolean.TRUE.equals(b.get("exceeded")))
                .toList();

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("companyTotalSpend", totalSpend != null ? totalSpend : 0.0);
        dashboard.put("pendingCount", pending != null ? pending : 0L);
        dashboard.put("forwardedCount", forwarded != null ? forwarded : 0L);
        dashboard.put("topTeams", topTeams);
        dashboard.put("budgetAlerts", budgetAlerts);
        dashboard.put("freezeStatus", freezePeriodService.isCurrentMonthFrozen());
        dashboard.put("month", month);
        dashboard.put("year", year);
        return ResponseEntity.ok(dashboard);
    }

    // ── private helpers ────────────────────────────────────────────────────────

    private void notifyUser(Expense expense, String action) {
        if (expense.getUser() != null) {
            try {
                // Notification fired inline via injected bean if needed.
                // For now, this is a placeholder that the NotificationService handles via
                // service events.
                log.info("Admin {} expense id={} for user={}", action, expense.getId(), expense.getUser().getEmail());
            } catch (Exception ignored) {
            }
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // AI FEATURES (Admin Role)
    // ══════════════════════════════════════════════════════════════════════

    /**
     * Feature 8: Fraud Pattern Detection
     * GET /api/admin/ai/fraud-insights
     * Analyzes recent expenses across all users for fraud signals.
     */
    @GetMapping("/ai/fraud-insights")
    public ResponseEntity<AIResponse> fraudInsights() {
        LocalDate now = LocalDate.now();
        List<Expense> recent = expenseRepository.findByMonthAndYear(
                now.getMonthValue(), now.getYear());
        return ResponseEntity.ok(aiService.fraudInsights(recent).join());
    }

    /**
     * Feature 9: Budget Overrun Prediction
     * GET /api/admin/ai/budget-prediction/{teamId}
     */
    @GetMapping("/ai/budget-prediction/{teamId}")
    public ResponseEntity<AIResponse> budgetPrediction(@PathVariable Long teamId) {
        LocalDate now = LocalDate.now();
        java.util.Map<String, Object> status = teamBudgetService.getBudgetStatus(
                teamId, now.getMonthValue(), now.getYear());
        String teamName = (String) status.getOrDefault("teamName", "Team");
        double budget = ((Number) status.getOrDefault("budget", 0.0)).doubleValue();
        double spent = ((Number) status.getOrDefault("spent", 0.0)).doubleValue();
        return ResponseEntity.ok(aiService.budgetPrediction(teamName, budget, spent).join());
    }

    /**
     * Feature 10: Policy Violation Detection
     * GET /api/admin/ai/policy-violations/{expenseId}
     * Checks a specific expense against standard policy rules.
     */
    @GetMapping("/ai/policy-violations/{expenseId}")
    public ResponseEntity<AIResponse> policyViolations(@PathVariable Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId).orElse(null);
        if (expense == null)
            return ResponseEntity.notFound().build();
        // Default policy rules — in production these would be loaded from
        // ExpensePolicyService
        String policyRules = """
                - Meals: max ₹1,000 per meal, ₹5,000 per day
                - Travel: economy class for domestic, business for international flights >6 hours
                - Hotels: max ₹8,000 per night domestic, ₹20,000 international
                - Office Supplies: single purchase max ₹10,000 without prior approval
                - Entertainment: requires manager pre-approval above ₹5,000
                - No personal expenses (groceries, clothing, etc.)
                """;
        return ResponseEntity.ok(aiService.policyViolation(expense, policyRules).join());
    }

    /**
     * Feature 11: Vendor ROI Analysis
     * GET /api/admin/ai/vendor-roi
     * Aggregates this month's expenses by vendor and suggests cost-saving
     * strategies.
     */
    @GetMapping("/ai/vendor-roi")
    public ResponseEntity<AIResponse> vendorROI() {
        LocalDate now = LocalDate.now();
        List<Expense> recent = expenseRepository.findByMonthAndYear(
                now.getMonthValue(), now.getYear());
        return ResponseEntity.ok(aiService.vendorROI(recent).join());
    }

    /**
     * Feature 10: AI Chatbot
     * POST /api/admin/ai/chat
     * Body: { "message": "...", "context": "..." }
     */
    @PostMapping("/ai/chat")
    public ResponseEntity<AIResponse> chat(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        User admin = userRepository.findByEmail(auth.getName()).orElseThrow();
        String message = (String) body.getOrDefault("message", "");
        String context = (String) body.getOrDefault("context", "");
        return ResponseEntity.ok(aiService.chat("ADMIN", admin.getName(), message, context).join());
    }
}
