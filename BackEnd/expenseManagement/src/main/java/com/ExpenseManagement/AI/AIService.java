package com.expensemanagement.AI;

import com.expensemanagement.entities.Expense;
import com.expensemanagement.entities.*;
import com.expensemanagement.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * High-level AI facade used by all controllers.
 *
 * <p>
 * All methods return {@link CompletableFuture<AIResponse>} — non-blocking.
 * Every error path is handled inside {@link OllamaService} and returns a
 * safe {@link AIResponse#fallback} — controllers never receive exceptions.
 *
 * <p>
 * NOTE: @Cacheable has been intentionally removed from all methods. Spring's
 * CacheInterceptor does not reliably support {@code CompletableFuture} return
 * types without an async-capable CacheManager (e.g. Caffeine with async mode
 * explicitly configured). Without it, the cache interceptor throws during
 * cache write/read, causing Spring MVC to return 400/500 responses.
 * If caching is needed, implement it inside the method body using a
 * ConcurrentHashMap or enable Spring's async cache support explicitly.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AIService {

        private final OllamaService ollamaService;
        private final ExpenseRepository expenseRepository;

        // ── Feature 1: Expense Categorization ────────────────────────────────────

        public CompletableFuture<AIResponse> categorize(String title, String description, double amount) {
                String prompt = PromptTemplates.categorize(title, description, amount);
                return ollamaService.askLightweight(prompt, "categorize");
        }

        // ── Feature 2: Rejection Explanation ─────────────────────────────────────

        public CompletableFuture<AIResponse> explainRejection(Expense expense) {
                String comment = expense.getApprovalComment() != null
                                ? expense.getApprovalComment()
                                : expense.getRejectionReason() != null
                                                ? expense.getRejectionReason()
                                                : "No specific reason provided.";

                String employeeName = (expense.getUser() != null && expense.getUser().getName() != null)
                                ? expense.getUser().getName()
                                : "Employee";

                String prompt = PromptTemplates.explainRejection(
                                employeeName,
                                expense.getTitle(),
                                expense.getAmount(),
                                expense.getCategory() != null ? expense.getCategory() : "Uncategorized",
                                comment);
                return ollamaService.ask(prompt, "explain-rejection");
        }

        // ── Feature 3: Personal Spending Insights ─────────────────────────────────

        public CompletableFuture<AIResponse> spendingInsights(User user) {
                List<Expense> all = expenseRepository.findByUser(user);
                double totalSpent = all.stream().mapToDouble(Expense::getAmount).sum();
                double approved = all.stream()
                                .filter(e -> com.expensemanagement.entities.Approval_Status.APPROVED
                                                .equals(e.getStatus()))
                                .mapToDouble(Expense::getAmount).sum();
                double pending = all.stream()
                                .filter(e -> com.expensemanagement.entities.Approval_Status.PENDING
                                                .equals(e.getStatus()))
                                .mapToDouble(Expense::getAmount).sum();
                String topCat = all.stream()
                                .filter(e -> e.getCategory() != null)
                                .collect(java.util.stream.Collectors.groupingBy(Expense::getCategory,
                                                java.util.stream.Collectors.summingDouble(Expense::getAmount)))
                                .entrySet().stream()
                                .max(java.util.Map.Entry.comparingByValue())
                                .map(java.util.Map.Entry::getKey).orElse("N/A");

                String prompt = PromptTemplates.spendingInsights(
                                user.getName(), totalSpent, approved, pending, topCat, all.size());
                return ollamaService.ask(prompt, "spending-insights");
        }

        // ── Feature 4: Approval Recommendation ───────────────────────────────────

        public CompletableFuture<AIResponse> approvalRecommendation(Expense expense, User expenseOwner) {
                double monthlySpend = expenseRepository.findByUser(expenseOwner).stream()
                                .filter(e -> {
                                        LocalDate d = e.getDate();
                                        LocalDate now = LocalDate.now();
                                        return d != null && d.getMonth() == now.getMonth()
                                                        && d.getYear() == now.getYear();
                                })
                                .mapToDouble(Expense::getAmount).sum();

                String prompt = PromptTemplates.approvalRecommendation(
                                expense.getTitle(), expense.getAmount(),
                                expense.getCategory() != null ? expense.getCategory() : "Uncategorized",
                                expense.getDescription() != null ? expense.getDescription() : "",
                                Boolean.TRUE.equals(expense.isDuplicate()),
                                monthlySpend);
                return ollamaService.ask(prompt, "approve-recommend");
        }

        // ── Feature 5: Risk Scoring ───────────────────────────────────────────────

        public CompletableFuture<AIResponse> riskScore(Expense expense, User expenseOwner) {
                List<Expense> all = expenseRepository.findByUser(expenseOwner);
                double avg = all.stream().mapToDouble(Expense::getAmount).average().orElse(0);

                String prompt = PromptTemplates.riskScore(
                                expense.getTitle(), expense.getAmount(),
                                expense.getCategory() != null ? expense.getCategory() : "Uncategorized",
                                Boolean.TRUE.equals(expense.isDuplicate()), avg);
                return ollamaService.ask(prompt, "risk-score");
        }

        // ── Feature 6: Team Summary ────────────────────────────────────────────────

        public CompletableFuture<AIResponse> teamSummary(List<User> members, double monthlySpend,
                        double budget, String teamName) {

                long pendingCount = expenseRepository.countByUserInAndStatus(members,
                                com.expensemanagement.entities.Approval_Status.PENDING);
                long approvedCount = expenseRepository.countByUserInAndStatus(members,
                                com.expensemanagement.entities.Approval_Status.APPROVED);

                List<Object[]> catData = expenseRepository.sumAmountByCategoryByUserIn(members);
                String topCat = catData.stream()
                                .max(java.util.Comparator.comparingDouble(r -> ((Number) r[1]).doubleValue()))
                                .map(r -> (String) r[0]).orElse("N/A");

                String prompt = PromptTemplates.teamSummary(
                                teamName, monthlySpend, budget,
                                (int) pendingCount, (int) approvedCount, topCat);
                return ollamaService.ask(prompt, "team-summary");
        }

        // ── Feature 7: Fraud Insights ──────────────────────────────────────────────

        public CompletableFuture<AIResponse> fraudInsights(List<Expense> recentExpenses) {
                StringBuilder sb = new StringBuilder("[");
                recentExpenses.stream().limit(30).forEach(e -> sb.append("\n  { title: \"").append(e.getTitle())
                                .append("\", amount: ").append(e.getAmount())
                                .append(", category: \"").append(e.getCategory()).append("\"")
                                .append(", duplicate: ").append(e.isDuplicate())
                                .append(", status: \"").append(e.getStatus()).append("\" },"));
                sb.append("\n]");

                String prompt = PromptTemplates.fraudInsights(sb.toString());
                return ollamaService.ask(prompt, "fraud-insights");
        }

        // ── Feature 8: Budget Prediction ──────────────────────────────────────────

        public CompletableFuture<AIResponse> budgetPrediction(String teamName, double budget, double spent) {
                LocalDate now = LocalDate.now();
                int daysElapsed = now.getDayOfMonth();
                int totalDays = now.lengthOfMonth();

                String prompt = PromptTemplates.budgetPrediction(
                                teamName, budget, spent, daysElapsed, totalDays);
                return ollamaService.ask(prompt, "budget-prediction");
        }

        // ── Feature 9: Policy Violations ──────────────────────────────────────────

        public CompletableFuture<AIResponse> policyViolation(Expense expense, String policyRules) {
                String prompt = PromptTemplates.policyViolation(
                                expense.getTitle(), expense.getAmount(),
                                expense.getCategory() != null ? expense.getCategory() : "Uncategorized",
                                policyRules);
                return ollamaService.askLightweight(prompt, "policy-violations");
        }

        // ── Feature 10: Chatbot ────────────────────────────────────────────────────

        public CompletableFuture<AIResponse> chat(String userRole, String userName,
                        String message, String contextSummary) {
                String prompt = PromptTemplates.chatbot(userRole, userName, message, contextSummary);
                return ollamaService.ask(prompt, "chatbot");
        }

        // ── Feature 11: Vendor ROI Analysis ───────────────────────────────────────

        public CompletableFuture<AIResponse> vendorROI(List<Expense> expenses) {
                java.util.Map<String, Double> vendorSpend = new java.util.LinkedHashMap<>();
                for (Expense e : expenses) {
                        String vendor = (e.getDescription() != null && !e.getDescription().isBlank())
                                        ? e.getDescription()
                                        : (e.getCategory() != null ? e.getCategory() : "Unknown");
                        vendorSpend.merge(vendor, e.getAmount(), Double::sum);
                }

                StringBuilder sb = new StringBuilder("[");
                vendorSpend.entrySet().stream()
                                .sorted(java.util.Map.Entry.<String, Double>comparingByValue().reversed())
                                .limit(20)
                                .forEach(entry -> sb.append("\n  { vendor: \"").append(entry.getKey())
                                                .append("\", totalSpent: ")
                                                .append(String.format("%.2f", entry.getValue()))
                                                .append(" },"));
                sb.append("\n]");

                String prompt = PromptTemplates.vendorROI(sb.toString());
                return ollamaService.ask(prompt, "vendor-roi");
        }

        // ── Backward-compatible sync wrappers ─────────────────────────────────────

        public AIResponse explainRejectionSync(Expense expense) {
                String employeeName = (expense.getUser() != null && expense.getUser().getName() != null)
                                ? expense.getUser().getName()
                                : "Employee";
                return ollamaService.askSync(PromptTemplates.explainRejection(
                                employeeName,
                                expense.getTitle(), expense.getAmount(),
                                expense.getCategory() != null ? expense.getCategory() : "Uncategorized",
                                expense.getApprovalComment() != null ? expense.getApprovalComment()
                                                : expense.getRejectionReason() != null ? expense.getRejectionReason()
                                                                : "No specific reason provided."),
                                "explain-rejection");
        }

        // ── Feature 12: Description Enhancer ─────────────────────────────────────

        public CompletableFuture<AIResponse> enhanceDescription(String title, double amount, String category) {
                String prompt = PromptTemplates.enhanceDescription(title, amount,
                                category != null ? category : "Uncategorized");
                return ollamaService.ask(prompt, "enhance-description");
        }

        // ── Feature 13: Audit Summary ────────────────────────────────────────────

        public CompletableFuture<AIResponse> auditSummary(List<Expense> expenses) {
                StringBuilder sb = new StringBuilder("[");
                expenses.stream().limit(50).forEach(e -> sb.append("\n  { title: \"").append(e.getTitle())
                                .append("\", amount: ").append(e.getAmount())
                                .append(", category: \"").append(e.getCategory())
                                .append("\", date: \"").append(e.getDate()).append("\" },"));
                sb.append("\n]");

                String prompt = PromptTemplates.auditSummary(sb.toString());
                return ollamaService.ask(prompt, "audit-summary");
        }

        public CompletableFuture<AIResponse> voiceParse(String text) {
                String prompt = PromptTemplates.voiceParse(text);
                return ollamaService.askLightweight(prompt, "voice-parse");
        }
}
