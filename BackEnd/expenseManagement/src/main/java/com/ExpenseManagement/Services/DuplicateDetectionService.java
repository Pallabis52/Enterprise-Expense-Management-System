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
public class DuplicateDetectionService {

    private final OllamaService ollamaService;
    private final ExpenseRepository expenseRepository;
    private final ObjectMapper objectMapper;

    public CompletableFuture<AIDTOs.DuplicateDetectionResult> detectDuplicate(Expense newExpense, User user) {
        List<Expense> recent = expenseRepository.findByUser(user).stream()
                .limit(10)
                .collect(Collectors.toList());

        if (recent.isEmpty()) {
            return CompletableFuture.completedFuture(AIDTOs.DuplicateDetectionResult.builder()
                    .duplicate("no")
                    .reason("No previous expenses found.")
                    .build());
        }

        String recentText = recent.stream()
                .map(e -> String.format("- %s (₹%.2f, %s, %s)", e.getTitle(), e.getAmount(), e.getDate(),
                        e.getCategory()))
                .collect(Collectors.joining("\n"));

        String prompt = String.format(
                "Check if this new expense is a duplicate of any recent expenses.\n\n" +
                        "New Expense: %s (₹%.2f, %s, %s)\n\n" +
                        "Recent Expenses:\n%s\n\n" +
                        "Return ONLY JSON: {\"duplicate\": \"yes/no\", \"reason\": \"...\"}",
                newExpense.getTitle(), newExpense.getAmount(), newExpense.getDate(), newExpense.getCategory(),
                recentText);

        return ollamaService.ask(prompt, "duplicate-detection")
                .thenApply(aiResponse -> {
                    if (aiResponse.isFallback()) {
                        return AIDTOs.DuplicateDetectionResult.builder()
                                .duplicate("no")
                                .reason("AI detection unavailable.")
                                .build();
                    }

                    try {
                        String json = extractJson(aiResponse.getResult());
                        return objectMapper.readValue(json, AIDTOs.DuplicateDetectionResult.class);
                    } catch (Exception e) {
                        log.error("Failed to parse duplicate detection result: {}", e.getMessage());
                        return AIDTOs.DuplicateDetectionResult.builder()
                                .duplicate("no")
                                .reason("Error in detection logic.")
                                .build();
                    }
                });
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
