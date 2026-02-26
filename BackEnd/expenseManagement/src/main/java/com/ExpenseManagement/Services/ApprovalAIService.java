package com.expensemanagement.services;

import com.expensemanagement.AI.OllamaService;
import com.expensemanagement.dto.AIDTOs;
import com.expensemanagement.entities.Expense;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApprovalAIService {

    private final OllamaService ollamaService;
    private final ObjectMapper objectMapper;

    public CompletableFuture<AIDTOs.ApprovalRecommendation> getRecommendation(Expense expense) {
        String prompt = String.format(
                "Act as a financial auditor for a manager. Recommend if this expense should be approved.\n\n" +
                        "Expense Details: %s (₹%.2f, %s, %s)\n" +
                        "Policy: Manager can approve up to ₹10,000.\n\n" +
                        "Return ONLY JSON with fields: decision (APPROVE, REJECT), reason.\n" +
                        "Example: {\"decision\": \"APPROVE\", \"reason\": \"Within monthly travel budget and policy limits.\"}",
                expense.getTitle(), expense.getAmount(), expense.getDate(), expense.getCategory());

        return ollamaService.ask(prompt, "approve-recommend")
                .thenApply(aiResponse -> {
                    if (aiResponse.isFallback()) {
                        return AIDTOs.ApprovalRecommendation.builder()
                                .decision("REJECT")
                                .reason("Manual review required – AI service offline.")
                                .build();
                    }

                    try {
                        String json = extractJson(aiResponse.getResult());
                        return objectMapper.readValue(json, AIDTOs.ApprovalRecommendation.class);
                    } catch (Exception e) {
                        log.error("Failed to parse approval recommendation: {}", e.getMessage());
                        return AIDTOs.ApprovalRecommendation.builder()
                                .decision("REJECT")
                                .reason("Error in recommendation engine. Please review manually.")
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
