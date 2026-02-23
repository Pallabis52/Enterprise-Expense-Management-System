package com.expensemanagement.AI;

/**
 * Prompt templates for voice command intent detection.
 *
 * Design rules:
 * - Always return ONLY a valid JSON object — no prose, no markdown fences.
 * - Keep the intent list exhaustive per role so the model doesn't hallucinate.
 * - Params are optional; use empty {} when no params are needed.
 */
public final class VoicePromptTemplates {

    private VoicePromptTemplates() {
    }

    // ── Shared instruction header ─────────────────────────────────────────────

    private static final String JSON_RULE = "IMPORTANT: Respond with ONLY a single valid JSON object. No markdown, no explanation.\n";

    // ── USER Intent Detection ─────────────────────────────────────────────────

    /**
     * Detects intent from a USER's voice transcript.
     *
     * Expected JSON output:
     * {
     * "intent": "SEARCH_EXPENSES",
     * "params": { "status": "PENDING", "category": "Travel" },
     * "confidence": "HIGH"
     * }
     */
    public static String userIntent(String transcript) {
        return """
                Instruction: You are an AI intent detector for an expense management system.
                Task: Analyze the user's voice transcript and categorize their intent into exactly one category.

                Allowed Intents:
                - SEARCH_EXPENSES  (Target: filter or find expenses)
                - CHECK_STATUS     (Target: counts of pending, approved, or rejected)
                - ADD_EXPENSE      (Target: create a new expense; extract title, amount, category)
                - SPENDING_SUMMARY (Target: personal spending insights)
                - UNKNOWN          (Target: intent is unclear)

                Parameter Rules:
                - SEARCH_EXPENSES: status (PENDING/APPROVED/REJECTED/FORWARDED_TO_ADMIN), category (string)
                - ADD_EXPENSE: title (string), amount (number), category (string), description (string)

                %s
                Voice Transcript: "%s"

                Output: Return ONLY a JSON object in this format:
                {"intent":"<INTENT>","params":{},"confidence":"HIGH|MEDIUM|LOW"}

                JSON Output:
                """
                .formatted(transcript, JSON_RULE);
    }

    // ── MANAGER Intent Detection ──────────────────────────────────────────────

    /**
     * Detects intent from a MANAGER's voice transcript.
     *
     * Expected JSON output:
     * {
     * "intent": "APPROVE_EXPENSE",
     * "params": { "expenseId": 42 },
     * "confidence": "HIGH"
     * }
     */
    public static String managerIntent(String transcript) {
        return """
                Instruction: You are an AI intent detector for an expense management system.
                Task: Analyze the manager's voice transcript and categorize their intent into exactly one category.

                Allowed Intents:
                - APPROVE_EXPENSE  (Target: approve specific expense; extract expenseId as number)
                - REJECT_EXPENSE   (Target: reject specific expense; extract expenseId and reason)
                - TEAM_SUMMARY     (Target: summary of team spending)
                - TEAM_QUERY       (Target: query team expenses; extract optional status or member name)
                - UNKNOWN          (Target: intent is unclear)

                Parameter Rules:
                - APPROVE_EXPENSE / REJECT_EXPENSE: expenseId (number), reason (string)
                - TEAM_QUERY: status (PENDING/APPROVED/REJECTED), memberName (string)

                %s
                Voice Transcript: "%s"

                Output: Return ONLY a JSON object in this format:
                {"intent":"<INTENT>","params":{},"confidence":"HIGH|MEDIUM|LOW"}

                JSON Output:
                """.formatted(transcript, JSON_RULE);
    }

    // ── ADMIN Intent Detection ────────────────────────────────────────────────

    /**
     * Detects intent from an ADMIN's voice transcript.
     *
     * Expected JSON output:
     * {
     * "intent": "BUDGET_QUERY",
     * "params": { "teamName": "Engineering" },
     * "confidence": "HIGH"
     * }
     */
    public static String adminIntent(String transcript) {
        return """
                You are an AI assistant for an enterprise expense management system.
                An admin spoke the following voice command. Detect their intent.

                Allowed intents:
                - BUDGET_QUERY  → admin asks about team budgets or overruns (extract optional teamName)
                - FRAUD_QUERY   → admin wants to run fraud/anomaly detection on recent expenses
                - VENDOR_ROI    → admin wants vendor spend analysis and cost-saving suggestions
                - UNKNOWN       → intent is unclear

                Allowed params for BUDGET_QUERY: teamName (string, optional)

                %s
                Voice transcript: "%s"

                JSON response format:
                {"intent":"<INTENT>","params":{},"confidence":"HIGH|MEDIUM|LOW"}
                """.formatted(JSON_RULE, transcript);
    }

    // ── Natural-language reply generator ─────────────────────────────────────

    /**
     * Generates a friendly, spoken-word reply summarising the data result.
     * Called after the intent has been resolved and data fetched.
     */
    public static String voiceReply(String intent, String dataSummary, String userName) {
        return """
                Instruction: You are a friendly voice assistant for an expense management system.
                Task: Generate a natural-sounding spoken response for %s.

                Context:
                - Intent Executed: %s
                - Resulting Data: %s

                Constraint: Reply in 1-2 conversational sentences. Address %s by first name.
                Tone: Helpful, direct, and natural. Do NOT use bullet points, markdown, or JSON.

                Output: Spoken reply text.
                """.formatted(userName, intent, dataSummary, userName);
    }
}
