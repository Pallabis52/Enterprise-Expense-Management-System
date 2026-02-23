package com.expensemanagement.AI;

/**
 * All prompt strings in one place.
 *
 * <p>
 * <b>Optimization note (v2):</b> Prompts have been trimmed to the minimum
 * required context so that Ollama has fewer tokens to process and fewer tokens
 * to generate, directly reducing latency. Each prompt ends with an
 * explicit brevity instruction.
 */
public final class PromptTemplates {

        private PromptTemplates() {
        }

        // ── Feature 1: Categorization ─────────────────────────────────────────────

        // ── Feature 1: Categorization ─────────────────────────────────────────────

        public static String categorize(String title, String description, double amount) {
                return """
                                Instruction: Classify the following expense into exactly ONE category from the list below.
                                Categories: [Travel, Accommodation, Meals, Office Supplies, Medical, Utilities, Training & Development, Entertainment, Software, Other]

                                Data:
                                - Title: %s
                                - Description: %s
                                - Amount: ₹%.2f

                                Output: Reply with ONLY the category name. No other text.
                                """
                                .formatted(title, description, amount);
        }

        // ── Feature 2: Rejection Explanation ─────────────────────────────────────

        public static String explainRejection(String title, double amount,
                        String category, String rejectionComment) {
                return """
                                Instruction: Write a friendly 2-3 sentence explanation to an employee about why their expense was rejected.
                                Details:
                                - Expense: %s
                                - Amount: ₹%.2f
                                - Category: %s
                                - Rejection Reason: %s

                                Tone: Empathetic, concise, and helpful.
                                Output: A short message suggesting how to resubmit correctly.
                                """
                                .formatted(title, amount, category, rejectionComment);
        }

        // ── Feature 3: Spending Insights ──────────────────────────────────────────

        public static String spendingInsights(String name, double totalSpent,
                        double approved, double pending, String topCategory, int expenseCount) {
                return """
                                Instruction: Provide 3 short, actionable spending insights for %s based on their expense data.
                                Data:
                                - Total Spent: ₹%.2f
                                - Approved: ₹%.2f
                                - Pending: ₹%.2f
                                - Top Category: %s
                                - Total Expenses: %d

                                Constraints: Max 60 words total. Use bullet points.
                                """
                                .formatted(name, totalSpent, approved, pending, topCategory, expenseCount);
        }

        // ── Feature 4: Approval Recommendation ───────────────────────────────────

        public static String approvalRecommendation(String title, double amount,
                        String category, String description, boolean isDuplicate, double monthlySpend) {
                return """
                                Instruction: Analyze this expense for a manager's approval.
                                Data:
                                - Expense: %s
                                - Amount: ₹%.2f
                                - Category: %s
                                - Description: %s
                                - Duplicate: %s
                                - Monthly Total: ₹%.2f

                                Output: Start with [APPROVE], [REJECT], or [ESCALATE] followed by a one-line reason.
                                """.formatted(title, amount, category, description, isDuplicate, monthlySpend);
        }

        // ── Feature 5: Risk Scoring ───────────────────────────────────────────────

        public static String riskScore(String title, double amount,
                        String category, boolean isDuplicate, double avgExpense) {
                return """
                                Instruction: Evaluate the fraud risk of this expense.
                                Data:
                                - Title: %s
                                - Amount: ₹%.2f
                                - Category: %s
                                - Duplicate Flag: %s
                                - User's Average Expense: ₹%.2f

                                Output: Choose [LOW], [MEDIUM], or [HIGH] risk and provide a one-sentence reason.
                                """.formatted(title, amount, category, isDuplicate, avgExpense);
        }

        // ── Feature 6: Team Summary ───────────────────────────────────────────────

        public static String teamSummary(String teamName, double monthlySpend, double budget,
                        int pendingCount, int approvedCount, String topCategory) {
                return """
                                Instruction: Summarize the financial status of the "%s" team.
                                Data:
                                - Budget: ₹%.2f
                                - Spent: ₹%.2f
                                - Pending: %d
                                - Approved: %d
                                - Top Category: %s

                                Constraints: Max 60 words. 3 concise bullet points highlighting budget status and risks.
                                """.formatted(teamName, budget, monthlySpend, pendingCount, approvedCount, topCategory);
        }

        // ── Feature 7: Fraud Insights ─────────────────────────────────────────────

        public static String fraudInsights(String expensesJson) {
                return """
                                Instruction: Identify the top 3 fraud or policy risk patterns from the following list of expenses.
                                Data (JSON):
                                %s

                                Output: 3 concise points. Max 80 words total.
                                """
                                .formatted(expensesJson);
        }

        // ── Feature 8: Budget Prediction ─────────────────────────────────────────

        public static String budgetPrediction(String teamName, double budget, double spent,
                        int daysElapsed, int totalDays) {
                return """
                                Instruction: Predict if the "%s" team will exceed their monthly budget.
                                Data:
                                - Monthly Budget: ₹%.2f
                                - Spent to date: ₹%.2f
                                - Days elapsed: %d out of %d

                                Output: Start with [SAFE], [AT RISK], or [EXCEEDED] followed by a one-sentence prediction.
                                """
                                .formatted(teamName, budget, spent, daysElapsed, totalDays);
        }

        // ── Feature 9: Policy Violation ───────────────────────────────────────────

        public static String policyViolation(String title, double amount,
                        String category, String policyRules) {
                return """
                                Instruction: Check if the following expense violates company policy.
                                Data:
                                - Expense: %s
                                - Amount: ₹%.2f
                                - Category: %s
                                - Policy Rules: %s

                                Output: Start with [COMPLIANT] or [VIOLATION] followed by a one-sentence reason.
                                """.formatted(title, amount, category, policyRules);
        }

        // ── Feature 10: Chatbot ───────────────────────────────────────────────────

        public static String chatbot(String role, String name, String message, String context) {
                return """
                                System: You are a helpful AI assistant for an Enterprise Expense Management System.
                                User Context: Role: %s, Name: %s.
                                Application Context: %s

                                User Message: %s

                                Instruction: Reply in 2-4 friendly and direct sentences.
                                """.formatted(role, name, context.isBlank() ? "None" : context, message);
        }

        // ── Feature 11: Vendor ROI ────────────────────────────────────────────────

        public static String vendorROI(String vendorSpendJson) {
                return """
                                Instruction: Analyze the following vendor spending data and provide top 3 cost-saving recommendations.
                                Data (JSON):
                                %s

                                Output: 3 actionable points. Max 80 words total.
                                """
                                .formatted(vendorSpendJson);
        }
}
