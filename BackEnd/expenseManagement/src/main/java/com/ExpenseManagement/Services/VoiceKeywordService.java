package com.expensemanagement.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Pure keyword-based voice intent parser — zero AI dependency.
 *
 * This is the fail-safe layer used when Ollama is unavailable.
 * It detects all 7 core intents via simple keyword matching and
 * extracts numeric expense IDs via regex.
 *
 * Intent map (matches spec):
 * "add expense" → ADD_EXPENSE
 * "approve expense" → APPROVE_EXPENSE
 * "reject expense" → REJECT_EXPENSE
 * "show expenses" → SHOW_EXPENSES
 * "team summary" → TEAM_SUMMARY
 * "fraud alerts" → FRAUD_ALERTS
 * "audit report" → AUDIT_REPORT
 * "risk" / "risky" → RISK_INSIGHTS
 * "policy" / "policies" → POLICY_INSIGHTS
 * "chat" / "ask" → AI_CHAT
 * "search" / "find" → SEARCH
 */
@Slf4j
@Service
public class VoiceKeywordService {

    private static final Pattern NUMBER_PATTERN = Pattern.compile("\\d+");

    /**
     * Parse voice text into an intent + params map using keyword detection.
     *
     * @param text raw transcript
     * @return Map with "intent" (String) and "params" (Map<String, Object>)
     */
    public Map<String, Object> parse(String text) {
        String lower = text.toLowerCase().trim();
        Map<String, Object> params = new HashMap<>();
        String intent;

        // ── Expense mutations (order matters: approve/reject before generic show) ──
        if (lower.contains("approve") && (lower.contains("expense") || extractId(lower) != null)) {
            intent = "APPROVE_EXPENSE";
            Long id = extractId(lower);
            if (id != null)
                params.put("expenseId", id);

        } else if (lower.contains("reject") && (lower.contains("expense") || extractId(lower) != null)) {
            intent = "REJECT_EXPENSE";
            Long id = extractId(lower);
            if (id != null)
                params.put("expenseId", id);
            // Extract reason after "reason" keyword
            int reasonIdx = lower.indexOf("reason");
            if (reasonIdx >= 0) {
                String reason = text.substring(reasonIdx + 6).trim();
                if (!reason.isBlank())
                    params.put("reason", reason);
            }

        } else if ((lower.contains("add") || lower.contains("create") || lower.contains("new"))
                && lower.contains("expense")) {
            intent = "ADD_EXPENSE";
            Long amount = extractId(lower);
            if (amount != null)
                params.put("amount", amount);

        } else if ((lower.contains("show") || lower.contains("list") || lower.contains("view")
                || lower.contains("my") || lower.contains("get")) && lower.contains("expense")) {
            intent = "SHOW_EXPENSES";
            // Detect status filter
            if (lower.contains("pending"))
                params.put("status", "PENDING");
            else if (lower.contains("approved"))
                params.put("status", "APPROVED");
            else if (lower.contains("rejected"))
                params.put("status", "REJECTED");

        } else if (lower.contains("team") && (lower.contains("summary") || lower.contains("spending")
                || lower.contains("budget") || lower.contains("spend"))) {
            intent = "TEAM_SUMMARY";

        } else if ((lower.contains("fraud") || lower.contains("anomaly") || lower.contains("suspicious"))
                && (lower.contains("alert") || lower.contains("detect") || lower.contains("insights")
                        || lower.contains("check"))) {
            intent = "FRAUD_ALERTS";

        } else if (lower.contains("audit") && (lower.contains("report") || lower.contains("log")
                || lower.contains("trail") || lower.contains("history"))
                || lower.equals("audit report")) {
            intent = "AUDIT_REPORT";

        } else if (lower.contains("spend") || lower.contains("how much")
                || lower.contains("total")) {
            intent = "SPENDING_SUMMARY";

        } else if (lower.contains("status") || lower.contains("pending") || lower.contains("approved")
                || lower.contains("rejected")) {
            intent = "CHECK_STATUS";

        } else if ((lower.contains("risk") || lower.contains("risky") || lower.contains("high risk"))
                && !lower.contains("fraud")) {
            intent = "RISK_INSIGHTS";

        } else if (lower.contains("policy") || lower.contains("policies") || lower.contains("compliance")) {
            intent = "POLICY_INSIGHTS";

        } else if (lower.contains("chat") || lower.contains("ask") || lower.contains("tell me")
                || lower.contains("explain") || lower.contains("what is") || lower.contains("help me")) {
            intent = "AI_CHAT";

        } else if (lower.contains("search") || lower.contains("find") || lower.contains("look for")) {
            intent = "SEARCH";

        } else {
            intent = "UNKNOWN";
        }

        log.info("[VoiceKeyword] text='{}' → intent={}, params={}", text, intent, params);

        Map<String, Object> result = new HashMap<>();
        result.put("intent", intent);
        result.put("params", params);
        result.put("confidence", intent.equals("UNKNOWN") ? "LOW" : "MEDIUM");
        return result;
    }

    /** Extract the first integer found in the text, or null. */
    private Long extractId(String text) {
        Matcher m = NUMBER_PATTERN.matcher(text);
        return m.find() ? Long.parseLong(m.group()) : null;
    }
}
