package com.expensemanagement.controller;

import com.expensemanagement.AI.AIResponse;
import com.expensemanagement.AI.AIService;
import com.expensemanagement.dto.AIDTOs;
import com.expensemanagement.entities.Expense;
import com.expensemanagement.entities.Team;
import com.expensemanagement.entities.User;
import com.expensemanagement.services.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private static final Logger log = LoggerFactory.getLogger(AIController.class);

    private final AIService aiService;
    private final ExpenseService expenseService;
    private final UserService userService;
    private final NaturalSearchService naturalSearchService;
    private final ExpensePolicyService policyService;
    private final ManagerService managerService;

    private User me(Authentication auth) {
        if (auth == null || auth.getName() == null)
            return null;
        return userService.getUserByEmail(auth.getName());
    }

    // ───────────────── STATUS ─────────────────

    @GetMapping("/status")
    public Map<String, Object> status(HttpServletRequest request) {
        Map<String, String> receivedHeaders = new HashMap<>();
        java.util.Enumeration<String> names = request.getHeaderNames();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            receivedHeaders.put(name, request.getHeader(name));
        }

        return Map.of(
                "engine", "OpenRouter",
                "model", aiService.getAiModelName(),
                "status", "AI Engine Ready",
                "receivedHeaders", receivedHeaders);
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
        log.info("AI-REQUEST [spending-insights] user={} role={}",
                auth != null ? auth.getName() : "anonymous",
                auth != null ? auth.getAuthorities() : "none");

        User user = me(auth);
        if (user == null) {
            log.warn("AI-FALLBACK: User context missing for spending-insights");
            return CompletableFuture.completedFuture(AIResponse.error("User profile not found."));
        }
        return aiService.spendingInsights(user);
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
        log.info("AI-REQUEST [recommendation] user={} role={}", auth.getName(), auth.getAuthorities());

        Expense expense = expenseService.getById(expenseId);
        if (expense == null) {
            log.warn("AI-FALLBACK: Expense {} not found for recommendation", expenseId);
            return CompletableFuture.completedFuture(AIResponse.error("Expense not found."));
        }

        User owner = expense.getUser() != null ? expense.getUser() : me(auth);
        if (owner == null)
            return CompletableFuture.completedFuture(AIResponse.error("User context missing."));

        return aiService.approvalRecommendation(expense, owner);
    }

    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @GetMapping("/risk-score/{expenseId}")
    public CompletableFuture<AIResponse> riskScore(@PathVariable Long expenseId, Authentication auth) {
        log.info("AI-REQUEST [risk-score] user={} role={}", auth.getName(), auth.getAuthorities());

        Expense expense = expenseService.getById(expenseId);
        if (expense == null) {
            log.warn("AI-FALLBACK: Expense {} not found for risk-score", expenseId);
            return CompletableFuture.completedFuture(AIResponse.error("Expense not found."));
        }

        User owner = expense.getUser() != null ? expense.getUser() : me(auth);
        if (owner == null)
            return CompletableFuture.completedFuture(AIResponse.error("User context missing."));

        return aiService.riskScore(expense, owner);
    }

    @GetMapping("/explain-rejection/{expenseId}")
    public CompletableFuture<AIResponse> explainRejection(@PathVariable Long expenseId, Authentication auth) {
        log.info("AI-REQUEST [explain-rejection] user={} role={}", auth.getName(), auth.getAuthorities());

        Expense expense = expenseService.getById(expenseId);
        if (expense == null) {
            log.warn("AI-FALLBACK: Expense {} not found for explain-rejection", expenseId);
            return CompletableFuture.completedFuture(AIResponse.error("Expense not found."));
        }
        return aiService.explainRejection(expense);
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

        log.info("AI-REQUEST [chat] user={} role={}", auth.getName(), auth.getAuthorities());

        User user = me(auth);
        if (user == null)
            return CompletableFuture.completedFuture(AIResponse.error("User not found."));

        String role = (user.getRole() != null) ? user.getRole().name().replace("ROLE_", "") : "USER";

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