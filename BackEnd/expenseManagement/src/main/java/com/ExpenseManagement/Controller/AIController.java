package com.expensemanagement.controller;

import com.expensemanagement.AI.AIResponse;
import com.expensemanagement.AI.AIService;
import com.expensemanagement.dto.AIDTOs;
import com.expensemanagement.entities.Expense;
import com.expensemanagement.entities.Team;
import com.expensemanagement.entities.User;
import com.expensemanagement.services.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

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

    // ───────────────── STATUS ─────────────────

    @GetMapping("/status")
    public Map<String, Object> status() {
        return Map.of(
                "ollamaAvailable", true,
                "model", "phi3",
                "status", "AI Engine Running");
    }

    // ───────────────── USER FEATURES ─────────────────

    @PostMapping("/categorize")
    public CompletableFuture<AIResponse> categorize(@RequestBody Map<String, Object> body) {
        return aiService.categorize(
                (String) body.getOrDefault("title", ""),
                (String) body.getOrDefault("description", ""),
                ((Number) body.getOrDefault("amount", 0)).doubleValue());
    }

    @GetMapping("/spending-insights")
    public CompletableFuture<AIResponse> spendingInsights(Authentication auth) {
        return aiService.spendingInsights(me(auth));
    }

    @PostMapping("/enhance-description")
    public CompletableFuture<AIResponse> enhanceDescription(@RequestBody Map<String, Object> body) {
        return aiService.enhanceDescription(
                (String) body.getOrDefault("title", ""),
                ((Number) body.getOrDefault("amount", 0)).doubleValue(),
                (String) body.getOrDefault("category", "Other"));
    }

    @PostMapping("/voice-parse")
    public CompletableFuture<AIResponse> voiceParse(@RequestBody Map<String, String> body) {
        return aiService.voiceParse(body.getOrDefault("text", ""));
    }

    // ───────────────── MANAGER FEATURES ─────────────────

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/team-summary")
    public CompletableFuture<AIResponse> teamSummary(Authentication auth) {
        User manager = me(auth);
        Team team = managerService.getTeam(manager.getId());

        if (team == null) {
            return CompletableFuture.completedFuture(
                    AIResponse.error("Manager has no team assigned"));
        }

        List<User> members = managerService.getTeamMembers(manager.getId());
        Map<String, Object> stats = managerService.getManagerDashboard(manager.getId());

        double spent = ((Number) stats.getOrDefault("monthlySpend", 0)).doubleValue();
        double budget = ((Number) stats.getOrDefault("teamBudget", 0)).doubleValue();

        return aiService.teamSummary(members, spent, budget, team.getName());
    }

    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @GetMapping("/recommendation/{expenseId}")
    public CompletableFuture<AIResponse> recommendation(@PathVariable Long expenseId, Authentication auth) {
        Expense expense = expenseService.getById(expenseId);
        if (expense == null)
            return CompletableFuture.completedFuture(AIResponse.error("Expense not found"));
        User owner = expense.getUser() != null ? expense.getUser() : me(auth);
        return aiService.approvalRecommendation(expense, owner);
    }

    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @GetMapping("/risk-score/{expenseId}")
    public CompletableFuture<AIResponse> riskScore(@PathVariable Long expenseId, Authentication auth) {
        Expense expense = expenseService.getById(expenseId);
        if (expense == null)
            return CompletableFuture.completedFuture(AIResponse.error("Expense not found"));
        User owner = expense.getUser() != null ? expense.getUser() : me(auth);
        return aiService.riskScore(expense, owner);
    }

    // ───────────────── ADMIN FEATURES ─────────────────

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/fraud-insights")
    public CompletableFuture<AIResponse> fraudInsights() {
        return aiService.fraudInsights(expenseService.getallExpenses());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/audit-summary")
    public CompletableFuture<AIResponse> auditSummary() {
        return aiService.auditSummary(expenseService.getallExpenses());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/vendor-roi")
    public CompletableFuture<AIResponse> vendorROI() {
        return aiService.vendorROI(expenseService.getallExpenses());
    }

    // ───────────────── COMMON FEATURES ─────────────────

    @PostMapping("/chat")
    public CompletableFuture<AIResponse> chat(
            @RequestBody AIDTOs.ChatRequest req,
            Authentication auth) {

        User user = me(auth);
        String role = user.getRole().name().replace("ROLE_", "");

        return aiService.chat(role, user.getName(), req.getMessage(), "");
    }

    @GetMapping("/search")
    public CompletableFuture<ResponseEntity<List<Expense>>> search(
            @RequestParam String query,
            Authentication auth) {

        return naturalSearchService.search(query, me(auth))
                .thenApply(ResponseEntity::ok);
    }
}