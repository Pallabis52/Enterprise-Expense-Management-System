package com.expensemanagement.services;

import com.expensemanagement.AI.AIResponse;
import com.expensemanagement.AI.OllamaService;
import com.expensemanagement.dto.AIDTOs;
import com.expensemanagement.entities.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatAssistantService {

    private final OllamaService ollamaService;

    public CompletableFuture<AIResponse> getChatResponse(String message, User user) {
        String role = user.getRole() != null ? user.getRole().name() : "USER";

        String prompt = String.format(
                "You are an AI assistant for an enterprise expense management system.\n" +
                        "User Name: %s\n" +
                        "User Role: %s\n" +
                        "Question: \"%s\"\n" +
                        "Provide a concise, helpful answer relevant to their role.",
                user.getName(), role, message);

        return ollamaService.ask(prompt, "chatbot");
    }
}
