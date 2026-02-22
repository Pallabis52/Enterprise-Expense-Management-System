package com.expensemanagement.AI;

/**
 * Centralized, structured prompt templates for every AI feature.
 *
 * Design rules:
 * - Be explicit: tell the model exactly what format to return.
 * - Be concise: shorter prompts = faster responses from DeepSeek.
 * - Be safe: never include PII beyond what's needed for the task.
 */
public final class PromptTemplates {

        private PromptTemplates() {
        }

        // ── Feature 1: Expense Categorization ────────────────────────────────────

        public static String categorize(String title, String description, double amount) {
                return """
                                You are an expense categorization assistant.
                                Classify the following expense into EXACTLY ONE of these categories:
                                Travel, Accommodation, Meals, Office Supplies, Medical, Utilities, Training & Development, Entertainment, Software, Other.

                                Expense:
                                  Title: %s
                                  Description: %s
                                  Amount: ₹%.2f

                                respond with ONLY the category name, nothing else.
                                """
                                .formatted(title, description, amount);
        }

        // ── Feature 2: Friendly Rejection Explanation ─────────────────────────────

        public static String explainRejection(String expenseTitle, double amount,
                        String category, String managerComment) {
                return """
                                You are a helpful HR assistant. A user's expense was rejected. Explain
                                the rejection clearly, empathetically, and in 2–3 concise sentences.
                                Suggest what they could do to fix it.

                                Expense: %s | ₹%.2f | Category: %s
                                Manager's comment: "%s"

                                Write directly to the employee (use "your expense").
                                """.formatted(expenseTitle, amount, category, managerComment);
        }

        // ── Feature 3: Personal Spending Insights ────────────────────────────────

        public static String spendingInsights(String userName, double totalSpent,
                        double approved, double pending,
                        String topCategory, int expenseCount) {
                return """
                                You are a personal finance assistant for enterprise employees.
                                Provide 3 concise, actionable insights about this employee's expense pattern.

                                Employee: %s
                                This month: ₹%.2f total | ₹%.2f approved | ₹%.2f pending
                                Most used category: %s
                                Total expenses submitted: %d

                                Format: numbered list, max 2 sentences per insight. Be friendly, not preachy.
                                """.formatted(userName, totalSpent, approved, pending, topCategory, expenseCount);
        }

        // ── Feature 4: Approval Recommendation ───────────────────────────────────

        public static String approvalRecommendation(String title, double amount,
                        String category, String description,
                        boolean isDuplicate, double employeeMonthlySpend) {
                return """
                                You are an expense approval advisor for a business.
                                Based on the details below, recommend APPROVE or REJECT and give 2 reasons.

                                Expense:
                                  Title: %s
                                  Amount: ₹%.2f
                                  Category: %s
                                  Description: %s
                                  Possible duplicate: %s
                                  Employee's total spend this month: ₹%.2f

                                Format:
                                RECOMMENDATION: [APPROVE/REJECT]
                                REASON 1: ...
                                REASON 2: ...
                                """.formatted(title, amount, category, description,
                                isDuplicate ? "YES" : "NO", employeeMonthlySpend);
        }

        // ── Feature 5: Risk Scoring ───────────────────────────────────────────────

        public static String riskScore(String title, double amount, String category,
                        boolean isDuplicate, double avgExpense) {
                return """
                                You are an expense risk analyst.
                                Score this expense from 1 (very low risk) to 10 (very high risk).

                                Expense: %s | ₹%.2f | Category: %s
                                Duplicate flag: %s
                                Employee's average expense amount: ₹%.2f

                                Format:
                                RISK_SCORE: [1-10]
                                EXPLANATION: [one sentence]
                                """.formatted(title, amount, category,
                                isDuplicate ? "YES" : "NO", avgExpense);
        }

        // ── Feature 6: Team Spending Summary ─────────────────────────────────────

        public static String teamSummary(String teamName, double monthlySpend,
                        double budget, int pendingCount,
                        int approvedCount, String topCategory) {
                return """
                                You are a team financial advisor. Write a 3-sentence natural language
                                summary of this team's expense activity for the current month.
                                Be factual, concise, and highlight any concerns.

                                Team: %s
                                Monthly spend: ₹%.2f / Budget: ₹%.2f
                                Pending approvals: %d | Approved: %d
                                Top spending category: %s
                                """.formatted(teamName, monthlySpend, budget,
                                pendingCount, approvedCount, topCategory);
        }

        // ── Feature 7: Fraud Pattern Detection ───────────────────────────────────

        public static String fraudInsights(String expenseSummaryJson) {
                return """
                                You are a corporate fraud detection specialist.
                                Analyze the following expense data and identify potential fraud patterns,
                                anomalies, or policy violations. Be specific and cite amounts/categories.

                                Expense summary data:
                                %s

                                List up to 5 findings. Format each as:
                                FINDING [n]: [description] | SEVERITY: [LOW/MEDIUM/HIGH]
                                """.formatted(expenseSummaryJson);
        }

        // ── Feature 8: Budget Overrun Prediction ─────────────────────────────────

        public static String budgetPrediction(String teamName, double budgetLimit,
                        double spentSoFar, int daysElapsed,
                        int totalDaysInMonth) {
                double burnRate = daysElapsed > 0 ? spentSoFar / daysElapsed : 0;
                double projected = burnRate * totalDaysInMonth;
                return """
                                You are a budget forecasting assistant.
                                Based on current spending trends, predict whether this team will
                                exceed their monthly budget.

                                Team: %s
                                Budget: ₹%.2f | Spent so far: ₹%.2f
                                Days elapsed: %d / %d | Daily burn rate: ₹%.2f
                                Projected end-of-month spend: ₹%.2f

                                Format:
                                PREDICTION: [WILL EXCEED / ON TRACK / UNDER BUDGET]
                                CONFIDENCE: [LOW/MEDIUM/HIGH]
                                EXPLANATION: [2 sentences max]
                                """.formatted(teamName, budgetLimit, spentSoFar,
                                daysElapsed, totalDaysInMonth, burnRate, projected);
        }

        // ── Feature 9: Policy Violation Detection ────────────────────────────────

        public static String policyViolation(String title, double amount,
                        String category, String policyRules) {
                return """
                                You are a corporate expense policy compliance officer.
                                Determine if the following expense violates the company policy rules.

                                Expense: %s | ₹%.2f | Category: %s

                                Company policy:
                                %s

                                Format:
                                VIOLATION: [YES/NO]
                                RULE_BREACHED: [rule name or "None"]
                                EXPLANATION: [one sentence]
                                """.formatted(title, amount, category, policyRules);
        }

        // ── Feature 11: Vendor ROI Analysis ──────────────────────────────────────

        public static String vendorROI(String vendorSummaryJson) {
                return """
                                You are a corporate procurement and vendor management specialist.
                                Analyze the following vendor expense data and suggest specific cost-saving strategies.
                                Focus on bulk discount opportunities, alternative vendors, and spending anomalies.

                                Vendor spend data:
                                %s

                                List up to 5 actionable recommendations. Format each as:
                                RECOMMENDATION [n]: [vendor name or category] | ACTION: [specific action] | ESTIMATED SAVING: [% or ₹ range]
                                """
                                .formatted(vendorSummaryJson);
        }

        // ── Feature 10: Chatbot ───────────────────────────────────────────────────

        public static String chatbot(String userRole, String userName, String userMessage,
                        String contextSummary) {
                String roleContext = switch (userRole.toUpperCase()) {
                        case "ADMIN" ->
                                "You help system administrators with company-wide expense management, budgets, compliance, and reporting.";
                        case "MANAGER" ->
                                "You help team managers review, approve, and understand team expense patterns.";
                        default ->
                                "You help employees submit expenses, understand policies, track their spending, and resolve rejections.";
                };

                return """
                                You are an AI assistant for an enterprise expense management system.
                                %s

                                User: %s | Role: %s
                                Context: %s

                                User's question: "%s"

                                Answer helpfully in 2–4 sentences. Be direct and specific.
                                If you don't know something, say so clearly.
                                """.formatted(roleContext, userName, userRole, contextSummary, userMessage);
        }
}
