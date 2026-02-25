package com.expensemanagement.Services;

import com.expensemanagement.AI.OllamaService;
import com.expensemanagement.DTO.AIDTOs;
import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.User;
import com.expensemanagement.Repository.ExpenseRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MoodInsightService {

    private final OllamaService ollamaService;
    private final ExpenseRepository expenseRepository;
    private final ObjectMapper objectMapper;

    public CompletableFuture<AIDTOs.MoodInsight> analyzeExpense(Expense expense, User user) {
        try {
            // Get recent spending context
            List<Expense> recent = expenseRepository.findByUser(user).stream()
                    .limit(5)
                    .toList();

            String recentSummary = recent.stream()
                    .map(e -> String.format("%s (₹%.2f)", e.getTitle(), e.getAmount()))
                    .collect(Collectors.joining(", "));

            String prompt = String.format(
                    "You are a financial behavior analyst.\n\n" +
                            "Analyze the expense text and spending pattern.\n\n" +
                            "Expense Description: %s\n" +
                            "Category: %s\n" +
                            "Amount: ₹%.2f\n" +
                            "Date: %s\n" +
                            "Recent Spending Pattern: %s\n\n" +
                            "Return ONLY JSON:\n" +
                            "{\n" +
                            "  \"mood\": \"(stress | routine | celebration | urgent | unknown)\",\n" +
                            "  \"explanation\": \"short reason\",\n" +
                            "  \"suggestion\": \"how to improve spending behavior\"\n" +
                            "}",
                    expense.getTitle() + " " + (expense.getDescription() != null ? expense.getDescription() : ""),
                    expense.getCategory(),
                    expense.getAmount(),
                    expense.getDate(),
                    recentSummary);

            return ollamaService.ask(prompt, "mood-insight").thenApply(aiResponse -> {
                if (aiResponse.isFallback()) {
                    return getFallback();
                }
                try {
                    String json = extractJson(aiResponse.getResult());
                    return objectMapper.readValue(json, AIDTOs.MoodInsight.class);
                } catch (Exception e) {
                    log.error("Failed to parse mood insight: {}", e.getMessage());
                    return getFallback();
                }
            });
        } catch (Exception e) {
            log.error("Mood analysis error: {}", e.getMessage());
            return CompletableFuture.completedFuture(getFallback());
        }
    }

    private AIDTOs.MoodInsight getFallback() {
        return AIDTOs.MoodInsight.builder()
                .mood("routine")
                .explanation("Regular spending pattern detected.")
                .suggestion("Maintain consistent budget tracking.")
                .build();
    }

    private String extractJson(String text) {
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return text.substring(start, end + 1);
        }
        return text;
    }
}
