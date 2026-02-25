package com.expensemanagement.Services;

import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.User;
import com.expensemanagement.Repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategorySuggestionService {

    private final ExpenseRepository expenseRepository;

    /**
     * Suggests categories based on past expense history for a specific user.
     */
    public List<String> suggestCategories(User user, String title) {
        try {
            // Get last 50 expenses for this user
            List<Expense> history = expenseRepository.findByUser(user, PageRequest.of(0, 50)).getContent();

            if (history.isEmpty())
                return List.of();

            // Count frequency of categories
            Map<String, Long> freq = history.stream()
                    .filter(e -> e.getCategory() != null)
                    .collect(Collectors.groupingBy(Expense::getCategory, Collectors.counting()));

            // Sort by frequency
            return freq.entrySet().stream()
                    .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                    .map(Map.Entry::getKey)
                    .limit(5)
                    .toList();
        } catch (Exception e) {
            log.error("Category suggestion failed (non-blocking): {}", e.getMessage());
            return List.of();
        }
    }
}
