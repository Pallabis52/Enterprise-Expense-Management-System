package com.expensemanagement.Controller;

import com.expensemanagement.AI.AIResponse;
import com.expensemanagement.dto.AIDTOs;
import com.expensemanagement.entities.Expense;
import com.expensemanagement.entities.User;
import com.expensemanagement.services.*;
import com.expensemanagement.services.MoodInsightService;
import com.expensemanagement.services.ConfidenceScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.expensemanagement.AI.OllamaService;
import com.expensemanagement.AI.AIService;
import com.expensemanagement.repository.ExpenseRepository;
import com.expensemanagement.repository.UserRepository;
import com.expensemanagement.services.NaturalSearchService;
import com.expensemanagement.services.ChatAssistantService;
import com.expensemanagement.services.VoiceParsingService;
import com.expensemanagement.services.ApprovalAIService;
import com.expensemanagement.services.UserService;
import com.expensemanagement.services.ManagerService;
import com.expensemanagement.services.TeamBudgetService;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

        private final NaturalSearchService naturalSearchService;
        private final ChatAssistantService chatAssistantService;
        private final VoiceParsingService voiceParsingService;
        private final ApprovalAIService approvalAIService;
        private final UserService userService;
        private final OllamaService ollamaService;
        private final ExpenseRepository expenseRepository;
        private final AIService aiFacade;
        private final UserRepository userRepository;
        private final ManagerService managerService;
        private final TeamBudgetService teamBudgetService;
        private final MoodInsightService moodInsightService;
        private final ConfidenceScoreService confidenceScoreService;

        // ── Auth & Status ────────────────────────────────────────────────────────

        @GetMapping("/status")
        @PreAuthorize("isAuthenticated()")
        public ResponseEntity<Map<String, Object>> status() {
                boolean online = ollamaService.isOnline();
                return ResponseEntity.ok(Map.of(
                                "ollamaAvailable", online,
                                "model", online ? ollamaService.getModelName() : "offline"));
        }

        @PostMapping("/chat")
        @PreAuthorize("isAuthenticated()")
        public CompletableFuture<ResponseEntity<AIResponse>> chat(
                        @RequestBody Map<String, String> body, Authentication auth) {
                String message = body.getOrDefault("message", "").trim();
                User user = userService.getUserByEmail(auth.getName());
                return chatAssistantService.getChatResponse(message, user)
                                .thenApply(ResponseEntity::ok);
        }

        @GetMapping("/suggestions")
        @PreAuthorize("isAuthenticated()")
        public ResponseEntity<List<String>> suggestions(Authentication auth) {
                User user = userService.getUserByEmail(auth.getName());
                String role = user.getRole() != null ? user.getRole().name() : "USER";

                List<String> suggestions = switch (role) {
                        case "ADMIN" -> List.of(
                                        "Show me fraud risk areas this month",
                                        "Which teams are at budget risk?",
                                        "Summarize policy violations this quarter",
                                        "What is the company's total spend this month?");
                        case "MANAGER" -> List.of(
                                        "Summarize my team's spending this month",
                                        "Which expenses should I prioritize reviewing?",
                                        "Are any of my team's expenses high risk?",
                                        "How is my team performing vs budget?");
                        default -> List.of(
                                        "Why was my expense rejected?",
                                        "What categories should I use for travel?",
                                        "How do I submit a receipt?",
                                        "What is the expense policy for meals?");
                };
                return ResponseEntity.ok(suggestions);
        }

        // ── User Features ────────────────────────────────────────────────────────

        @GetMapping("/search")
        @PreAuthorize("isAuthenticated()")
        public CompletableFuture<ResponseEntity<List<Expense>>> search(
                        @RequestParam String query, Authentication auth) {
                User user = userService.getUserByEmail(auth.getName());
                return naturalSearchService.search(query, user)
                                .thenApply(ResponseEntity::ok);
        }

        @PostMapping("/categorize")
        @PreAuthorize("hasRole('USER')")
        public CompletableFuture<ResponseEntity<AIResponse>> categorize(
                        @RequestBody Map<String, Object> body) {
                String title = (String) body.getOrDefault("title", "");
                String description = (String) body.getOrDefault("description", "");
                double amount = body.containsKey("amount") ? ((Number) body.get("amount")).doubleValue() : 0.0;
                return aiFacade.categorize(title, description, amount).thenApply(ResponseEntity::ok);
        }

        @GetMapping("/explain-rejection/{expenseId}")
        @PreAuthorize("hasRole('USER')")
        public CompletableFuture<ResponseEntity<AIResponse>> explainRejection(
                        @PathVariable Long expenseId, Authentication auth) {
                User user = userService.getUserByEmail(auth.getName());
                Expense expense = expenseRepository.findByIdAndUser(expenseId, user).orElse(null);
                if (expense == null)
                        return CompletableFuture.completedFuture(ResponseEntity.notFound().build());
                return aiFacade.explainRejection(expense).thenApply(ResponseEntity::ok);
        }

        @GetMapping("/spending-insights")
        @PreAuthorize("hasRole('USER')")
        public CompletableFuture<ResponseEntity<AIResponse>> spendingInsights(Authentication auth) {
                User user = userService.getUserByEmail(auth.getName());
                return aiFacade.spendingInsights(user).thenApply(ResponseEntity::ok);
        }

        @PostMapping("/voice-parse")
        @PreAuthorize("hasRole('USER')")
        public CompletableFuture<ResponseEntity<AIDTOs.VoiceParseResult>> parseVoice(
                        @RequestBody Map<String, String> body) {
                String text = body.getOrDefault("text", "");
                return voiceParsingService.parseVoice(text)
                                .thenApply(ResponseEntity::ok);
        }

        // ── Manager Features ─────────────────────────────────────────────────────

        @GetMapping("/recommendation/{expenseId}")
        @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
        public CompletableFuture<ResponseEntity<AIResponse>> getRecommendation(
                        @PathVariable Long expenseId, Authentication auth) {
                User manager = userRepository.findByEmail(auth.getName()).orElseThrow();
                Expense expense = managerService.getExpenseById(expenseId, manager);
                if (expense == null)
                        return CompletableFuture.completedFuture(ResponseEntity.notFound().build());
                return aiFacade.approvalRecommendation(expense, expense.getUser()).thenApply(ResponseEntity::ok);
        }

        @GetMapping("/risk-score/{expenseId}")
        @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
        public CompletableFuture<ResponseEntity<AIResponse>> riskScore(
                        @PathVariable Long expenseId, Authentication auth) {
                User manager = userRepository.findByEmail(auth.getName()).orElseThrow();
                Expense expense = managerService.getExpenseById(expenseId, manager);
                if (expense == null)
                        return CompletableFuture.completedFuture(ResponseEntity.notFound().build());
                return aiFacade.riskScore(expense, expense.getUser()).thenApply(ResponseEntity::ok);
        }

        @GetMapping("/team-summary")
        @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
        public CompletableFuture<ResponseEntity<AIResponse>> teamSummary(Authentication auth) {
                User manager = userRepository.findByEmail(auth.getName()).orElseThrow();
                com.expensemanagement.entities.Team team = managerService.getTeam(manager.getId());
                if (team == null)
                        return CompletableFuture.completedFuture(ResponseEntity.badRequest().build());
                List<User> members = team.getMembers();
                java.time.LocalDate now = java.time.LocalDate.now();
                Double monthlySpend = managerService.getTeamMonthlySpend(members, now.getMonthValue(), now.getYear());
                Double budget = managerService.getTeamBudget(team.getId(), now.getMonthValue(), now.getYear());
                return aiFacade.teamSummary(members, monthlySpend != null ? monthlySpend : 0,
                                budget != null ? budget : 0,
                                team.getName()).thenApply(ResponseEntity::ok);
        }

        // ── Admin Features ───────────────────────────────────────────────────────

        @GetMapping("/fraud-insights")
        @PreAuthorize("hasRole('ADMIN')")
        public CompletableFuture<ResponseEntity<AIResponse>> fraudInsights() {
                java.time.LocalDate now = java.time.LocalDate.now();
                List<Expense> recent = expenseRepository.findByMonthAndYear(now.getMonthValue(), now.getYear());
                return aiFacade.fraudInsights(recent).thenApply(ResponseEntity::ok);
        }

        @GetMapping("/budget-prediction/{teamId}")
        @PreAuthorize("hasRole('ADMIN')")
        public CompletableFuture<ResponseEntity<AIResponse>> budgetPrediction(@PathVariable Long teamId) {
                java.time.LocalDate now = java.time.LocalDate.now();
                java.util.Map<String, Object> status = teamBudgetService.getBudgetStatus(teamId, now.getMonthValue(),
                                now.getYear());
                String teamName = (String) status.getOrDefault("teamName", "Team");
                double budget = ((Number) status.getOrDefault("budget", 0.0)).doubleValue();
                double spent = ((Number) status.getOrDefault("spent", 0.0)).doubleValue();
                return aiFacade.budgetPrediction(teamName, budget, spent).thenApply(ResponseEntity::ok);
        }

        @GetMapping("/policy-violations/{expenseId}")
        @PreAuthorize("hasRole('ADMIN')")
        public CompletableFuture<ResponseEntity<AIResponse>> policyViolations(@PathVariable Long expenseId) {
                Expense expense = expenseRepository.findById(expenseId).orElse(null);
                if (expense == null)
                        return CompletableFuture.completedFuture(ResponseEntity.notFound().build());
                String policyRules = "- Meals: max ₹1,000 per meal, ₹5,000 per day\n- Travel: economy...\n";
                return aiFacade.policyViolation(expense, policyRules).thenApply(ResponseEntity::ok);
        }

        @GetMapping("/vendor-roi")
        @PreAuthorize("hasRole('ADMIN')")
        public CompletableFuture<ResponseEntity<AIResponse>> vendorROI() {
                java.time.LocalDate now = java.time.LocalDate.now();
                List<Expense> recent = expenseRepository.findByMonthAndYear(now.getMonthValue(), now.getYear());
                return aiFacade.vendorROI(recent).thenApply(ResponseEntity::ok);
        }

        // ── Additional Features ──────────────────────────────────────────────────

        @PostMapping("/enhance-description")
        @PreAuthorize("isAuthenticated()")
        public CompletableFuture<ResponseEntity<AIResponse>> enhanceDescription(
                        @RequestBody Map<String, Object> body) {
                String title = (String) body.getOrDefault("title", "");
                String category = (String) body.getOrDefault("category", "");
                double amount = body.containsKey("amount") ? ((Number) body.get("amount")).doubleValue() : 0.0;
                return aiFacade.enhanceDescription(title, amount, category).thenApply(ResponseEntity::ok);
        }

        @GetMapping("/audit-summary")
        @PreAuthorize("hasRole('ADMIN')")
        public CompletableFuture<ResponseEntity<AIResponse>> auditSummary() {
                java.time.LocalDate now = java.time.LocalDate.now();
                List<Expense> all = expenseRepository.findByMonthAndYear(now.getMonthValue(), now.getYear());
                return aiFacade.auditSummary(all).thenApply(ResponseEntity::ok);
        }

        // ── Phase 9: Advanced Insights ──────────────────────────────────────────

        @GetMapping("/mood-insight/{expenseId}")
        @PreAuthorize("isAuthenticated()")
        public CompletableFuture<ResponseEntity<AIDTOs.MoodInsight>> getMoodInsight(
                        @PathVariable Long expenseId, Authentication auth) {
                User user = userService.getUserByEmail(auth.getName());
                Expense expense = expenseRepository.findById(expenseId).orElse(null);
                if (expense == null)
                        return CompletableFuture.completedFuture(ResponseEntity.notFound().build());
                return moodInsightService.analyzeExpense(expense, user).thenApply(ResponseEntity::ok);
        }

        @GetMapping("/confidence-score/{expenseId}")
        @PreAuthorize("isAuthenticated()")
        public ResponseEntity<AIDTOs.ConfidenceScoreResult> getConfidenceScore(@PathVariable Long expenseId) {
                Expense expense = expenseRepository.findById(expenseId).orElse(null);
                if (expense == null)
                        return ResponseEntity.notFound().build();
                return ResponseEntity.ok(confidenceScoreService.calculateScore(expense));
        }
}
