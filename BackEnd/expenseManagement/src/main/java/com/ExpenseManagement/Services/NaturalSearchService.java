package com.expensemanagement.services;

import com.expensemanagement.AI.AIResponse;
import com.expensemanagement.AI.OllamaService;
import com.expensemanagement.dto.AIDTOs;
import com.expensemanagement.entities.Expense;
import com.expensemanagement.entities.User;
import com.expensemanagement.repository.ExpenseRepository;
import com.expensemanagement.security.ExpenseSpecification;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class NaturalSearchService {

    private final OllamaService ollamaService;
    private final ExpenseRepository expenseRepository;
    private final ObjectMapper objectMapper;

    public CompletableFuture<List<Expense>> search(String query, User user) {
        String prompt = String.format(
                "Convert this natural language query into structured search filters JSON.\n" +
                        "Query: \"%s\"\n" +
                        "Return ONLY JSON with these fields: status (PENDING, APPROVED, REJECTED), category, minAmount (number), month.\n"
                        +
                        "Example: {\"status\": \"REJECTED\", \"category\": \"travel\", \"minAmount\": null, \"month\": \"January\"}",
                query);

        return ollamaService.ask(prompt, "natural-search")
                .thenApply(aiResponse -> {
                    if (aiResponse.isFallback()) {
                        log.warn("AI search fallback – performing keyword match on description");
                        return expenseRepository.findByUser(user).stream()
                                .filter(e -> e.getDescription() != null
                                        && e.getDescription().toLowerCase().contains(query.toLowerCase()))
                                .toList();
                    }

                    try {
                        String json = extractJson(aiResponse.getResult());
                        AIDTOs.SearchFilters filters = objectMapper.readValue(json, AIDTOs.SearchFilters.class);
                        log.info("AI Search Filters: {}", filters);
                        return expenseRepository.findAll(ExpenseSpecification.filterBy(filters, user));
                    } catch (Exception ex) {
                        log.error("Failed to parse AI search filters: {}", ex.getMessage());
                        return expenseRepository.findByUser(user).stream()
                                .filter(e -> e.getDescription() != null
                                        && e.getDescription().toLowerCase().contains(query.toLowerCase()))
                                .toList();
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
