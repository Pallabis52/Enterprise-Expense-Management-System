package com.expensemanagement.Controller;

import com.expensemanagement.AI.AIResponse;
import com.expensemanagement.AI.AIService;
import com.expensemanagement.Entities.User;
import com.expensemanagement.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AI Chatbot — accessible by all authenticated roles.
 * POST /api/ai/chat
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatbotController {

    private final AIService aiService;
    private final UserService userService;

    /**
     * Universal chatbot endpoint for all roles.
     *
     * Request body:
     * {
     * "message": "What is my top spending category?",
     * "context": "optional extra context string" (optional)
     * }
     *
     * Example response:
     * {
     * "feature": "chatbot",
     * "result": "Based on your history, Travel is your top category...",
     * "model": "deepseek-r1:latest",
     * "processingMs": 1240,
     * "fallback": false
     * }
     */
    @PostMapping("/chat")
    public ResponseEntity<AIResponse> chat(
            @RequestBody Map<String, String> body,
            Authentication auth) {

        String message = body.getOrDefault("message", "").trim();
        String context = body.getOrDefault("context", "No additional context provided.");

        if (message.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(AIResponse.fallback("chatbot", 0));
        }

        User user = userService.getUserByEmail(auth.getName());
        String role = user.getRole() != null ? user.getRole().name() : "USER";

        AIResponse response = aiService.chat(role, user.getName(), message, context);
        return ResponseEntity.ok(response);
    }

    /**
     * Health check — tells the frontend whether Ollama is reachable.
     * GET /api/ai/status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        // Quick ping — use a trivial prompt
        AIResponse probe = aiService.chat("USER", "system", "ping", "health check");
        return ResponseEntity.ok(Map.of(
                "ollamaAvailable", !probe.isFallback(),
                "model", probe.getModel()));
    }

    /**
     * Quick FAQ suggestions for the chat UI — no AI call needed.
     * GET /api/ai/suggestions
     */
    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> suggestions(Authentication auth) {
        User user = userService.getUserByEmail(auth.getName());
        String role = user.getRole() != null ? user.getRole().name() : "USER";

        List<String> suggestions = switch (role) {
            case "ADMIN" -> List.of(
                    "Show me fraud risk areas this month",
                    "Which teams are at budget risk?",
                    "Summarize policy violations this quarter",
                    "What is the company's total spend this month?");
            case "MANAGER" -> List.of(
                    "Summarize my team's spending this month",
                    "Which expenses should I prioritize reviewing?",
                    "Are any of my team's expenses high risk?",
                    "How is my team performing vs budget?");
            default -> List.of(
                    "Why was my expense rejected?",
                    "What categories should I use for travel?",
                    "How do I submit a receipt?",
                    "What is the expense policy for meals?");
        };
        return ResponseEntity.ok(suggestions);
    }
}
