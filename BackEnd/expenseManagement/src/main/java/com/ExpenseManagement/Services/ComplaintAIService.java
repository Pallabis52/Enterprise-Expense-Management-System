package com.expensemanagement.services;

import com.expensemanagement.AI.AIResponse;
import com.expensemanagement.AI.AIService;
import com.expensemanagement.AI.OllamaService;
import com.expensemanagement.AI.PromptTemplates;
import com.expensemanagement.entities.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class ComplaintAIService {

    private final AIService aiService;
    private final OllamaService ollamaService; // Keep for direct access if needed, though aiService is preferred

    public CompletableFuture<Complaint_Department> classifyDepartment(String title, String description) {
        String prompt = PromptTemplates.classifyComplaintDepartment(title, description);
        return aiService.askLightweight(prompt, "complaint-routing")
                .thenApply(response -> {
                    String text = response.getResult().toUpperCase();
                    if (text.contains("ADMIN"))
                        return Complaint_Department.ADMIN;
                    if (text.contains("FINANCE"))
                        return Complaint_Department.FINANCE;
                    return Complaint_Department.MANAGER;
                });
    }

    public CompletableFuture<Complaint_Priority> detectPriority(String title, String description) {
        String prompt = PromptTemplates.detectComplaintPriority(title, description);
        return aiService.askLightweight(prompt, "complaint-priority")
                .thenApply(response -> {
                    String text = response.getResult().toUpperCase();
                    if (text.contains("CRITICAL"))
                        return Complaint_Priority.CRITICAL;
                    if (text.contains("HIGH"))
                        return Complaint_Priority.HIGH;
                    if (text.contains("LOW"))
                        return Complaint_Priority.LOW;
                    return Complaint_Priority.MEDIUM;
                });
    }

    public CompletableFuture<Complaint_Sentiment> detectSentiment(String title, String description) {
        String prompt = PromptTemplates.detectComplaintSentiment(title, description);
        return aiService.askLightweight(prompt, "complaint-sentiment")
                .thenApply(response -> {
                    String text = response.getResult().toUpperCase();
                    if (text.contains("ANGRY"))
                        return Complaint_Sentiment.ANGRY;
                    if (text.contains("POSITIVE"))
                        return Complaint_Sentiment.POSITIVE;
                    return Complaint_Sentiment.NEUTRAL;
                });
    }

    public CompletableFuture<Integer> detectRiskScore(String title, String description) {
        String prompt = PromptTemplates.detectFraudRisk(title, description);
        return aiService.askLightweight(prompt, "complaint-risk")
                .thenApply(response -> {
                    try {
                        String text = response.getResult().replaceAll("[^0-9]", "");
                        return text.isEmpty() ? 10 : Integer.parseInt(text);
                    } catch (Exception e) {
                        return 10;
                    }
                });
    }

    public CompletableFuture<String> suggestResponse(String title, String description) {
        String prompt = PromptTemplates.suggestComplaintResponse(title, description);
        return aiService.ask(prompt, "complaint-suggest-response")
                .thenApply(AIResponse::getResult);
    }

    public CompletableFuture<String> suggestSolutions(String partialText) {
        String prompt = PromptTemplates.suggestComplaintSolutions(partialText);
        return aiService.askLightweight(prompt, "complaint-suggest-solutions")
                .thenApply(AIResponse::getResult);
    }
}
