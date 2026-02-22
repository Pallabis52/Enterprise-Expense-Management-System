package com.expensemanagement.AI;

import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.User;
import com.expensemanagement.Repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * High-level AI facade used by all controllers.
 * Each method builds the prompt from live data and delegates to OllamaService.
 */
@Service
@RequiredArgsConstructor
public class AIService {

        private final OllamaService ollamaService;
        private final ExpenseRepository expenseRepository;

        // ── Feature 1: Expense Categorization ─────────────────────────────────────

        public CompletableFuture<AIResponse> categorize(String title, String description, double amount) {
                String prompt = PromptTemplates.categorize(title, description, amount);
                return ollamaService.ask(prompt, "categorize");
        }

        // ── Feature 2: Rejection Explanation ──────────────────────────────────────

        public AIResponse explainRejection(Expense expense) {
                String comment = expense.getApprovalComment() != null
                                ? expense.getApprovalComment()
                                : expense.getRejectionReason() != null
                                                ? expense.getRejectionReason()
                                                : "No specific reason provided.";

                String prompt = PromptTemplates.explainRejection(
                                expense.getTitle(),
                                expense.getAmount(),
                                expense.getCategory() != null ? expense.getCategory() : "Uncategorized",
                                comment);
                return ollamaService.askSync(prompt, "explain-rejection");
        }

        // ── Feature 3: Personal Spending Insights ──────────────────────────────────

        public AIResponse spendingInsights(User user) {
                List<Expense> all = expenseRepository.findByUser(user);
                double totalSpent = all.stream().mapToDouble(Expense::getAmount).sum();
                double approved = all.stream()
                                .filter(e -> com.expensemanagement.Entities.Approval_Status.APPROVED
                                                .equals(e.getStatus()))
                                .mapToDouble(Expense::getAmount).sum();
                double pending = all.stream()
                                .filter(e -> com.expensemanagement.Entities.Approval_Status.PENDING
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
                return ollamaService.askSync(prompt, "spending-insights");
        }

        // ── Feature 4: Approval Recommendation ────────────────────────────────────

        public AIResponse approvalRecommendation(Expense expense, User expenseOwner) {
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
                return ollamaService.askSync(prompt, "approve-recommend");
        }

        // ── Feature 5: Risk Scoring ────────────────────────────────────────────────

        public AIResponse riskScore(Expense expense, User expenseOwner) {
                List<Expense> all = expenseRepository.findByUser(expenseOwner);
                double avg = all.stream().mapToDouble(Expense::getAmount).average().orElse(0);

                String prompt = PromptTemplates.riskScore(
                                expense.getTitle(), expense.getAmount(),
                                expense.getCategory() != null ? expense.getCategory() : "Uncategorized",
                                Boolean.TRUE.equals(expense.isDuplicate()), avg);
                return ollamaService.askSync(prompt, "risk-score");
        }

        // ── Feature 6: Team Summary ────────────────────────────────────────────────

        public AIResponse teamSummary(List<User> members, double monthlySpend,
                        double budget, String teamName) {
                List<com.expensemanagement.Entities.Approval_Status> pending = List
                                .of(com.expensemanagement.Entities.Approval_Status.PENDING);

                long pendingCount = expenseRepository.countByUserInAndStatus(members,
                                com.expensemanagement.Entities.Approval_Status.PENDING);
                long approvedCount = expenseRepository.countByUserInAndStatus(members,
                                com.expensemanagement.Entities.Approval_Status.APPROVED);

                List<Object[]> catData = expenseRepository.sumAmountByCategoryByUserIn(members);
                String topCat = catData.stream()
                                .max(java.util.Comparator.comparingDouble(r -> ((Number) r[1]).doubleValue()))
                                .map(r -> (String) r[0]).orElse("N/A");

                String prompt = PromptTemplates.teamSummary(
                                teamName, monthlySpend, budget,
                                (int) pendingCount, (int) approvedCount, topCat);
                return ollamaService.askSync(prompt, "team-summary");
        }

        // ── Feature 7: Fraud Insights ──────────────────────────────────────────────

        public AIResponse fraudInsights(List<Expense> recentExpenses) {
                // Build a compact JSON-like summary for the prompt
                StringBuilder sb = new StringBuilder("[");
                recentExpenses.stream().limit(30).forEach(e -> sb.append("\n  { title: \"").append(e.getTitle())
                                .append("\", amount: ").append(e.getAmount())
                                .append(", category: \"").append(e.getCategory()).append("\"")
                                .append(", duplicate: ").append(e.isDuplicate())
                                .append(", status: \"").append(e.getStatus()).append("\" },"));
                sb.append("\n]");

                String prompt = PromptTemplates.fraudInsights(sb.toString());
                return ollamaService.askSync(prompt, "fraud-insights");
        }

        // ── Feature 8: Budget Prediction ──────────────────────────────────────────

        public AIResponse budgetPrediction(String teamName, double budget, double spent) {
                LocalDate now = LocalDate.now();
                int daysElapsed = now.getDayOfMonth();
                int totalDays = now.lengthOfMonth();

                String prompt = PromptTemplates.budgetPrediction(
                                teamName, budget, spent, daysElapsed, totalDays);
                return ollamaService.askSync(prompt, "budget-prediction");
        }

        // ── Feature 9: Policy Violations ──────────────────────────────────────────

        public AIResponse policyViolation(Expense expense, String policyRules) {
                String prompt = PromptTemplates.policyViolation(
                                expense.getTitle(), expense.getAmount(),
                                expense.getCategory() != null ? expense.getCategory() : "Uncategorized",
                                policyRules);
                return ollamaService.askSync(prompt, "policy-violations");
        }

        // ── Feature 10: Chatbot ────────────────────────────────────────────────────

        public AIResponse chat(String userRole, String userName,
                        String message, String contextSummary) {
                String prompt = PromptTemplates.chatbot(userRole, userName, message, contextSummary);
                return ollamaService.askSync(prompt, "chatbot");
        }

        // ── Feature 11: Vendor ROI Analysis ───────────────────────────────────────

        public AIResponse vendorROI(List<Expense> expenses) {
                // Aggregate spend by vendor (using description as vendor identifier)
                java.util.Map<String, Double> vendorSpend = new java.util.LinkedHashMap<>();
                for (Expense e : expenses) {
                        String vendor = (e.getDescription() != null && !e.getDescription().isBlank())
                                        ? e.getDescription()
                                        : (e.getCategory() != null ? e.getCategory() : "Unknown");
                        vendorSpend.merge(vendor, e.getAmount(), (a, b) -> a + b);
                }

                // Build compact JSON-like summary (top 20 vendors by spend)
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
                return ollamaService.askSync(prompt, "vendor-roi");
        }
}
