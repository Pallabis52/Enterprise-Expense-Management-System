package com.expensemanagement.controller;

import com.expensemanagement.AI.AIResponse;
import com.expensemanagement.AI.AIService;
import com.expensemanagement.dto.AIDTOs;
import com.expensemanagement.entities.Expense;
import com.expensemanagement.entities.User;
import com.expensemanagement.entities.Team;
import com.expensemanagement.services.ExpensePolicyService;
import com.expensemanagement.services.ExpenseService;
import com.expensemanagement.services.NaturalSearchService;
import com.expensemanagement.services.UserService;
import com.expensemanagement.services.ManagerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * All AI-powered endpoints under /api/ai/*
 * Accessible to all authenticated roles (USER, MANAGER, ADMIN).
 * Aligned with aiService.js frontend specifications.
 */
@Slf4j
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;
    private final ExpenseService expenseService;
    private final UserService userService;
    private final NaturalSearchService naturalSearchService;
    private final ExpensePolicyService policyService;
    private final ManagerService managerService;

    private User me(Authentication auth) {
        return userService.getUserByEmail(auth.getName());
    }

    // ── Health & Status ──────────────────────────────────────────────────────

    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        return Map.of(
                "ollamaAvailable", true,
                "model", "phi3:latest",
                "status", "AI Engine Operational");
    }

    // ── Feature 1: Categorize ────────────────────────────────────────────────

    @PostMapping("/categorize")
    public CompletableFuture<AIResponse> categorize(@RequestBody Map<String, Object> body) {
        String title = (String) body.getOrDefault("title", "");
        String desc = (String) body.getOrDefault("description", "");
        double amount = ((Number) body.getOrDefault("amount", 0)).doubleValue();
        return aiService.categorize(title, desc, amount);
    }

    // ── Feature 2: Explain Rejection ─────────────────────────────────────────

    @GetMapping("/explain-rejection/{expenseId}")
    public CompletableFuture<AIResponse> explainRejection(@PathVariable Long expenseId) {
        Expense expense = expenseService.getById(expenseId);
        if (expense == null)
            return CompletableFuture.completedFuture(AIResponse.fallback("explain-rejection", expenseId));
        return aiService.explainRejection(expense);
    }

    // ── Feature 3: Spending Insights ─────────────────────────────────────────

    @GetMapping("/spending-insights")
    public CompletableFuture<AIResponse> spendingInsights(Authentication auth) {
        return aiService.spendingInsights(me(auth));
    }

    // ── Feature 4: Approval Recommendation ─────────────────────────────────

    @GetMapping("/recommendation/{expenseId}")
    public CompletableFuture<AIResponse> approvalRecommendation(@PathVariable Long expenseId, Authentication auth) {
        Expense expense = expenseService.getById(expenseId);
        if (expense == null)
            return CompletableFuture.completedFuture(AIResponse.fallback("recommendation", expenseId));
        User owner = expense.getUser() != null ? expense.getUser() : me(auth);
        return aiService.approvalRecommendation(expense, owner);
    }

    // ── Feature 5: Risk Score ────────────────────────────────────────────────

    @GetMapping("/risk-score/{expenseId}")
    public CompletableFuture<AIResponse> riskScore(@PathVariable Long expenseId, Authentication auth) {
        Expense expense = expenseService.getById(expenseId);
        if (expense == null)
            return CompletableFuture.completedFuture(AIResponse.fallback("risk-score", expenseId));
        User owner = expense.getUser() != null ? expense.getUser() : me(auth);
        return aiService.riskScore(expense, owner);
    }

    // ── Feature 6: Team Summary ─────────────────────────────────────────────

    @GetMapping("/team-summary")
    public CompletableFuture<AIResponse> teamSummary(Authentication auth) {
        User manager = me(auth);
        Team team = managerService.getTeam(manager.getId());
        if (team == null)
            return CompletableFuture.completedFuture(AIResponse.fallback("team-summary", 0L));

        List<User> members = managerService.getTeamMembers(manager.getId());
        Map<String, Object> stats = managerService.getManagerDashboard(manager.getId());
        double spent = ((Number) stats.getOrDefault("monthlySpend", 0.0)).doubleValue();
        double budget = ((Number) stats.getOrDefault("teamBudget", 0.0)).doubleValue();

        return aiService.teamSummary(members, spent, budget, team.getName());
    }

    // ── Feature 7: Fraud Insights ────────────────────────────────────────────

    @GetMapping("/fraud-insights")
    public CompletableFuture<AIResponse> fraudInsights() {
        List<Expense> all = expenseService.getallExpenses();
        return aiService.fraudInsights(all);
    }

    // ── Feature 8: Budget Prediction ─────────────────────────────────────────

    @GetMapping("/budget-prediction/{teamId}")
    public CompletableFuture<AIResponse> budgetPrediction(@PathVariable Long teamId, Authentication auth) {
        // We use the specified teamId or fallback to current user's team if manager
        Team team = managerService.getTeam(me(auth).getId());
        if (team == null)
            return CompletableFuture.completedFuture(AIResponse.fallback("budget-prediction", teamId));

        Map<String, Object> stats = managerService.getManagerDashboard(me(auth).getId());
        double spent = ((Number) stats.getOrDefault("monthlySpend", 0.0)).doubleValue();
        double budget = ((Number) stats.getOrDefault("teamBudget", 0.0)).doubleValue();

        return aiService.budgetPrediction(team.getName(), budget, spent);
    }

    // ── Feature 9: Policy Violations ──────────────────────────────────────────

    @GetMapping("/policy-violations/{expenseId}")
    public CompletableFuture<AIResponse> policyViolations(@PathVariable Long expenseId) {
        Expense expense = expenseService.getById(expenseId);
        if (expense == null)
            return CompletableFuture.completedFuture(AIResponse.fallback("policy-violations", expenseId));
        String rules = policyService.getActivePolicies().stream()
                .map(p -> p.getName() + ": max=" + p.getMaxAmount())
                .reduce("", (a, b) -> a + "\n" + b);
        return aiService.policyViolation(expense, rules);
    }

    // ── Feature 10: Chatbot ──────────────────────────────────────────────────

    @PostMapping("/chat")
    public CompletableFuture<AIResponse> chat(
            @RequestBody AIDTOs.ChatRequest req, Authentication auth) {
        User user = me(auth);
        String role = user.getRole() != null ? user.getRole().name() : "USER";
        return aiService.chat(role, user.getName(), req.getMessage(), "");
    }

    // ── Feature 11: Vendor ROI ───────────────────────────────────────────────

    @GetMapping("/vendor-roi")
    public CompletableFuture<AIResponse> vendorRoi() {
        return aiService.vendorROI(expenseService.getallExpenses());
    }

    // ── Feature 12: Enhance Description ─────────────────────────────────────

    @PostMapping("/enhance-description")
    public CompletableFuture<AIResponse> enhanceDescription(@RequestBody Map<String, Object> body) {
        String title = (String) body.getOrDefault("title", "");
        double amount = ((Number) body.getOrDefault("amount", 0)).doubleValue();
        String category = (String) body.getOrDefault("category", "Other");
        return aiService.enhanceDescription(title, amount, category);
    }

    // ── Feature 13: Audit Summary ────────────────────────────────────────────

    @GetMapping("/audit-summary")
    public CompletableFuture<AIResponse> auditSummary() {
        return aiService.auditSummary(expenseService.getallExpenses());
    }

    // ── Feature 15: Voice Parse ──────────────────────────────────────────────

    @PostMapping("/voice-parse")
    public CompletableFuture<AIResponse> voiceParse(@RequestBody Map<String, String> body) {
        String text = body.getOrDefault("text", body.getOrDefault("transcript", ""));
        return aiService.voiceParse(text);
    }

    // ── Natural Language Search ──────────────────────────────────────────────

    @GetMapping("/search")
    public CompletableFuture<ResponseEntity<List<Expense>>> naturalSearch(
            @RequestParam String query, Authentication auth) {
        return naturalSearchService.search(query, me(auth))
                .thenApply(ResponseEntity::ok);
    }
}
