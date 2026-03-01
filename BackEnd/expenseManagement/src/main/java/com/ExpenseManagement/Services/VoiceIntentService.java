package com.expensemanagement.services;

import com.expensemanagement.AI.AIResponse;
import com.expensemanagement.AI.AIService;
import com.expensemanagement.AI.OllamaService;
import com.expensemanagement.AI.VoicePromptTemplates;
import com.expensemanagement.AI.VoiceResponse;
import com.expensemanagement.entities.Approval_Status;
import com.expensemanagement.entities.Expense;
import com.expensemanagement.entities.Team;
import com.expensemanagement.entities.User;
import com.expensemanagement.repository.ExpenseRepository;
import com.expensemanagement.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Core voice intelligence service.
 *
 * Flow:
 * 1. Ask AI assistant to detect intent from the transcript (role-scoped
 * prompt).
 * 2. Parse the JSON response into intent + params.
 * 3. Route to existing services to fetch live data.
 * 4. Generate a friendly spoken reply via a second AI call.
 * 5. Return VoiceResponse containing intent, reply and structured data.
 *
 * Fail-safe: if Ollama is unavailable at step 1, VoiceKeywordService
 * provides a pure keyword-based fallback so the feature always works.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VoiceIntentService {

    private final OllamaService ollamaService;
    private final AIService aiService;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final ManagerService managerService;
    private final TeamBudgetService teamBudgetService;
    private final AuditLogService auditLogService;
    private final VoiceKeywordService voiceKeywordService;
    private final ObjectMapper objectMapper;

    // ── Entry point ────────────────────────────────────────────────────────────

    public CompletableFuture<VoiceResponse> resolveAsync(String transcript, User user) {
        long start = System.currentTimeMillis();
        String role = user.getRole() != null ? user.getRole().name() : "USER";

        // Step 1: detect intent via AI assistant
        String intentPrompt = buildIntentPrompt(role, transcript);

        return ollamaService.ask(intentPrompt, "voice-intent")
                .thenCompose(intentResponse -> {
                    if (intentResponse.isFallback()) {
                        // ── AI offline → keyword fallback ─────────────────────
                        log.warn("Ollama unavailable for user={}, falling back to keyword parser", user.getEmail());
                        Map<String, Object> kw = voiceKeywordService.parse(transcript);
                        String kwIntent = (String) kw.get("intent");
                        @SuppressWarnings("unchecked")
                        Map<String, Object> kwParams = (Map<String, Object>) kw.getOrDefault("params", Map.of());

                        if ("UNKNOWN".equals(kwIntent)) {
                            return CompletableFuture.completedFuture(
                                    VoiceResponse.builder()
                                            .intent("UNKNOWN")
                                            .params(Map.of())
                                            .reply("Sorry, I didn't understand. Try saying 'show my expenses', 'approve expense 42', or 'team summary'.")
                                            .fallback(true)
                                            .processingMs(System.currentTimeMillis() - start)
                                            .build());
                        }

                        return routeIntentAsync(kwIntent, kwParams, user, role)
                                .thenApply(data -> VoiceResponse.success(
                                        kwIntent, kwParams,
                                        buildFallbackReply(kwIntent, data),
                                        data,
                                        System.currentTimeMillis() - start));
                    }

                    // Step 2: parse JSON
                    Map<String, Object> parsed = parseIntentJson(intentResponse.getResult());
                    String intent = (String) parsed.getOrDefault("intent", "UNKNOWN");
                    Map<String, Object> params = (Map<String, Object>) parsed.getOrDefault("params", Map.of());

                    log.info("Voice intent detected: {} | user={} | role={}", intent, user.getEmail(), role);

                    // Step 3: route to data
                    return routeIntentAsync(intent, params, user, role)
                            .thenCompose(data -> {
                                // Step 4: generate friendly spoken reply
                                String dataSummary = summarize(intent, data, params);
                                String replyPrompt = VoicePromptTemplates.voiceReply(intent, dataSummary,
                                        user.getName());

                                return ollamaService.ask(replyPrompt, "voice-reply")
                                        .thenApply(replyResponse -> {
                                            String reply = replyResponse.isFallback()
                                                    ? buildFallbackReply(intent, data)
                                                    : stripThinkingTags(replyResponse.getResult());

                                            return VoiceResponse.success(intent, params, reply, data,
                                                    System.currentTimeMillis() - start);
                                        });
                            });
                })
                .exceptionally(e -> {
                    log.error("Voice intent resolution failed for user={}: {}", user.getEmail(), e.getMessage(), e);
                    return VoiceResponse.fallback(System.currentTimeMillis() - start);
                });
    }

    @Deprecated
    public VoiceResponse resolve(String transcript, User user) {
        return resolveAsync(transcript, user).join();
    }

    // ── Intent prompt factory ─────────────────────────────────────────────────

    private String buildIntentPrompt(String role, String transcript) {
        return switch (role) {
            case "MANAGER" -> VoicePromptTemplates.managerIntent(transcript);
            case "ADMIN" -> VoicePromptTemplates.adminIntent(transcript);
            default -> VoicePromptTemplates.userIntent(transcript);
        };
    }

    // ── Intent router ─────────────────────────────────────────────────────────

    private CompletableFuture<Object> routeIntentAsync(String intent, Map<String, Object> params,
            User user, String role) {
        LocalDate now = LocalDate.now();
        return switch (intent) {

            // ── USER intents ──────────────────────────────────────────────────

            case "SEARCH_EXPENSES" -> {
                List<Expense> allExpenses = expenseRepository.findByUser(user);
                String statusStr = (String) params.get("status");
                String category = (String) params.get("category");
                List<Expense> filtered = allExpenses.stream()
                        .filter(e -> statusStr == null || (e.getStatus() != null
                                && e.getStatus().name().equalsIgnoreCase(statusStr)))
                        .filter(e -> category == null || (e.getCategory() != null
                                && e.getCategory().equalsIgnoreCase(category)))
                        .limit(10)
                        .toList();
                yield CompletableFuture.completedFuture(filtered);
            }

            case "CHECK_STATUS" -> {
                List<Expense> userExpenses = expenseRepository.findByUser(user);
                long pending = userExpenses.stream()
                        .filter(e -> Approval_Status.PENDING.equals(e.getStatus())).count();
                long approved = userExpenses.stream()
                        .filter(e -> Approval_Status.APPROVED.equals(e.getStatus())).count();
                long rejected = userExpenses.stream()
                        .filter(e -> Approval_Status.REJECTED.equals(e.getStatus())).count();
                yield CompletableFuture
                        .completedFuture(Map.of("pending", pending, "approved", approved, "rejected", rejected));
            }

            case "ADD_EXPENSE" -> {
                Map<String, Object> prefill = new HashMap<>();
                prefill.put("title", params.getOrDefault("title", ""));
                prefill.put("amount", params.getOrDefault("amount", 0));
                prefill.put("category", params.getOrDefault("category", ""));
                prefill.put("description", params.getOrDefault("description", ""));
                prefill.put("action", "PREFILL_FORM");
                yield CompletableFuture.completedFuture(prefill);
            }

            case "SPENDING_SUMMARY" -> {
                yield aiService.spendingInsights(user)
                        .thenApply(summary -> Map.of("insightText", summary.getResult(), "fallback",
                                summary.isFallback()));
            }

            // ── MANAGER intents ───────────────────────────────────────────────

            case "APPROVE_EXPENSE" -> {
                Object idObj = params.get("expenseId");
                if (idObj == null)
                    yield CompletableFuture.completedFuture(
                            Map.of("error", "No expense ID found in command. Say: 'approve expense 42'"));

                Long expenseId = extractId(idObj);
                if (expenseId == null) {
                    yield CompletableFuture.completedFuture(
                            Map.of("error", "Invalid expense ID format: " + idObj));
                }
                yield CompletableFuture.completedFuture(managerService.approveExpense(expenseId, user.getId()));
            }

            case "REJECT_EXPENSE" -> {
                Object idObj = params.get("expenseId");
                if (idObj == null)
                    yield CompletableFuture.completedFuture(
                            Map.of("error", "No expense ID found in command. Say: 'reject expense 42'"));

                Long expenseId = extractId(idObj);
                if (expenseId == null) {
                    yield CompletableFuture.completedFuture(
                            Map.of("error", "Invalid expense ID format: " + idObj));
                }
                String reason = (String) params.getOrDefault("reason", "Rejected via voice command");
                yield CompletableFuture.completedFuture(managerService.rejectExpense(expenseId, reason));
            }

            case "TEAM_SUMMARY" -> {
                Team team = user.getTeam();
                if (team == null)
                    yield CompletableFuture.completedFuture(Map.of("error", "No team assigned to this manager"));
                List<User> members = team.getMembers();
                Double spent = managerService.getTeamMonthlySpend(members, now.getMonthValue(), now.getYear());
                Double budget = managerService.getTeamBudget(team.getId(), now.getMonthValue(), now.getYear());
                yield aiService.teamSummary(members, spent != null ? spent : 0,
                        budget != null ? budget : 0, team.getName())
                        .thenApply(summary -> Map.of("teamName", team.getName(), "spent", spent, "budget", budget,
                                "insightText", summary.getResult()));
            }

            case "TEAM_QUERY" -> {
                String statusStr2 = (String) params.get("status");
                Approval_Status statusFilter = null;
                try {
                    if (statusStr2 != null)
                        statusFilter = Approval_Status.valueOf(statusStr2.toUpperCase());
                } catch (IllegalArgumentException ignored) {
                }
                yield CompletableFuture.completedFuture(managerService.getTeamExpenses(user.getId(), statusFilter,
                        org.springframework.data.domain.PageRequest.of(0, 10)).getContent());
            }

            // ── ADMIN intents ─────────────────────────────────────────────────

            case "BUDGET_QUERY" -> {
                List<Map<String, Object>> budgets = teamBudgetService.getAllBudgetStatuses(
                        now.getMonthValue(), now.getYear());
                String teamName = (String) params.get("teamName");
                if (teamName != null) {
                    yield CompletableFuture.completedFuture(budgets.stream()
                            .filter(b -> teamName.equalsIgnoreCase((String) b.get("teamName")))
                            .toList());
                }
                yield CompletableFuture.completedFuture(budgets);
            }

            case "FRAUD_QUERY" -> {
                List<Expense> recent = expenseRepository.findByMonthAndYear(
                        now.getMonthValue(), now.getYear());
                yield aiService.fraudInsights(recent)
                        .thenApply(fraud -> Map.of("insightText", fraud.getResult(), "fallback", fraud.isFallback()));
            }

            case "VENDOR_ROI" -> {
                List<Expense> recent2 = expenseRepository.findByMonthAndYear(
                        now.getMonthValue(), now.getYear());
                yield aiService.vendorROI(recent2)
                        .thenApply(roi -> Map.of("insightText", roi.getResult(), "fallback", roi.isFallback()));
            }

            // ── ADMIN: Audit Report ───────────────────────────────────────────

            case "SHOW_EXPENSES" -> {
                List<Expense> allExp;
                String statusStr = (String) params.get("status");
                if (statusStr != null) {
                    try {
                        Approval_Status s = Approval_Status.valueOf(statusStr.toUpperCase());
                        allExp = expenseRepository.findByStatus(s);
                    } catch (IllegalArgumentException ex) {
                        allExp = expenseRepository.findAll();
                    }
                } else {
                    allExp = expenseRepository.findByUser(user);
                }
                yield CompletableFuture.completedFuture(allExp.stream().limit(10).toList());
            }

            case "FRAUD_ALERTS" -> {
                List<Expense> recent3 = expenseRepository.findByMonthAndYear(
                        now.getMonthValue(), now.getYear());
                yield aiService.fraudInsights(recent3)
                        .thenApply(fraud -> Map.of(
                                "insightText", fraud.getResult(),
                                "fallback", fraud.isFallback(),
                                "scannedCount", recent3.size()));
            }

            case "AUDIT_REPORT" -> {
                // Return last 20 audit entries (ADMIN-triggered)
                var auditPage = auditLogService.getAll(
                        org.springframework.data.domain.PageRequest.of(0, 20));
                yield CompletableFuture.completedFuture(
                        Map.of("entries", auditPage.getContent(),
                                "totalRecords", auditPage.getTotalElements()));
            }

            // ── MANAGER: Risk Insights ─────────────────────────────────────────────
            case "RISK_INSIGHTS" -> {
                List<Expense> recentExpenses = expenseRepository.findByMonthAndYear(
                        now.getMonthValue(), now.getYear());
                yield aiService.fraudInsights(recentExpenses)
                        .thenApply(risk -> Map.of(
                                "insightText", risk.getResult(),
                                "fallback", risk.isFallback(),
                                "type", "RISK_ANALYSIS",
                                "count", recentExpenses.size()));
            }

            // ── ALL: AI Chat ───────────────────────────────────────────────────────
            case "AI_CHAT" -> {
                // params may carry a "query" key from AI extraction; fall back to empty string
                String question = (String) params.getOrDefault("query", "");
                yield aiService.spendingInsights(user)
                        .thenApply(chat -> Map.of(
                                "insightText", chat.getResult(),
                                "fallback", chat.isFallback(),
                                "type", "AI_CHAT"));
            }

            // ── ALL: Natural Language Search ───────────────────────────────────────
            case "SEARCH" -> {
                String query = (String) params.getOrDefault("query", "");
                String statusStr = (String) params.get("status");
                List<Expense> searchResults = expenseRepository.findByUser(user)
                        .stream()
                        .filter(e -> query.isBlank() || (e.getTitle() != null
                                && e.getTitle().toLowerCase().contains(query.toLowerCase()))
                                || (e.getCategory() != null
                                        && e.getCategory().toLowerCase().contains(query.toLowerCase())))
                        .filter(e -> statusStr == null || (e.getStatus() != null
                                && e.getStatus().name().equalsIgnoreCase(statusStr)))
                        .limit(10)
                        .toList();
                yield CompletableFuture.completedFuture(searchResults);
            }

            // ── ADMIN: Policy Insights ─────────────────────────────────────────────
            case "POLICY_INSIGHTS" -> {
                List<Expense> all = expenseRepository.findByMonthAndYear(
                        now.getMonthValue(), now.getYear());
                yield aiService.vendorROI(all)
                        .thenApply(policy -> Map.of(
                                "insightText", policy.getResult(),
                                "fallback", policy.isFallback(),
                                "type", "POLICY_INSIGHTS",
                                "period", now.getMonth().name() + " " + now.getYear()));
            }

            default -> CompletableFuture.completedFuture(
                    Map.of("message", "Sorry, I didn't understand. Try again.",
                            "suggestion", "Try: 'show my expenses', 'approve expense 42', or 'team summary'"));
        };
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Robustly extracts a Long ID from an object that might be a String, Number,
     * or even a bracketed string like "[42]".
     */
    private Long extractId(Object obj) {
        if (obj == null)
            return null;
        String s = obj.toString().trim();

        // Remove brackets if present (AI sometimes returns "[42]" or "[42, 43]")
        s = s.replaceAll("[\\[\\]]", "");

        // If it was a list "[42, 43]", take the first one
        if (s.contains(",")) {
            s = s.split(",")[0].trim();
        }

        try {
            return Long.valueOf(s);
        } catch (NumberFormatException e) {
            log.warn("Failed to extract numeric ID from: {}", obj);
            return null;
        }
    }

    private Map<String, Object> parseIntentJson(String raw) {
        // Strip any AI <think>...</think> tags first
        String cleaned = stripThinkingTags(raw).trim();

        // Extract JSON object from response (model sometimes adds prose around it)
        int start = cleaned.indexOf('{');
        int end = cleaned.lastIndexOf('}');
        if (start >= 0 && end > start) {
            cleaned = cleaned.substring(start, end + 1);
        }

        try {
            return objectMapper.readValue(cleaned, new TypeReference<>() {
            });
        } catch (Exception e) {
            log.warn("Failed to parse voice intent JSON: {}", cleaned);
            return Map.of("intent", "UNKNOWN", "params", Map.of());
        }
    }

    /** Remove AI internal chain-of-thought tags from the output */
    private String stripThinkingTags(String text) {
        if (text == null)
            return "";
        return text.replaceAll("(?s)<think>.*?</think>", "").trim();
    }

    /** Build a compact text summary of the data result for the reply prompt */
    private String summarize(String intent, Object data, Map<String, Object> params) {
        if (data == null)
            return "No data returned.";
        if (data instanceof List<?> list)
            return "Found " + list.size() + " results for intent " + intent + ".";
        if (data instanceof Map<?, ?> map) {
            if (map.containsKey("insightText"))
                return map.get("insightText").toString();
            return map.toString();
        }
        if (data instanceof Expense e)
            return "Expense '" + e.getTitle() + "' ₹" + e.getAmount() + " is now " + e.getStatus() + ".";
        return data.toString();
    }

    /** Generates a non-AI fallback reply for when the reply call fails */
    private String buildFallbackReply(String intent, Object data) {
        return switch (intent) {
            case "SEARCH_EXPENSES" -> data instanceof List<?> l
                    ? "I found " + l.size() + " matching expenses for you."
                    : "Here are your matching expenses.";
            case "CHECK_STATUS" -> "Here's your current expense status summary.";
            case "ADD_EXPENSE" -> "I've pre-filled the expense form with the details you mentioned.";
            case "APPROVE_EXPENSE" -> "The expense has been approved successfully.";
            case "REJECT_EXPENSE" -> "The expense has been rejected.";
            case "TEAM_SUMMARY" -> "Here's your team's spending summary.";
            case "BUDGET_QUERY" -> "Here are the current budget statuses for all teams.";
            case "FRAUD_QUERY" -> "Fraud analysis is complete. Please review the findings.";
            default -> "Done. Here are the results of your voice command.";
        };
    }
}
