package com.expensemanagement.Controller;

import com.expensemanagement.AI.AIResponse;
import com.expensemanagement.DTO.AIDTOs;
import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.User;
import com.expensemanagement.Services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.expensemanagement.AI.OllamaService;
import com.expensemanagement.Repository.ExpenseRepository;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

        private final NaturalSearchService naturalSearchService;
        private final ChatAssistantService chatAssistantService;
        private final VoiceParsingService voiceParsingService;
        private final ApprovalAIService approvalAIService;
        private final UserService userService;
        private final OllamaService ollamaService;
        private final ExpenseRepository expenseRepository;

        // 1. Natural Language Search
        @GetMapping("/search")
        public CompletableFuture<ResponseEntity<List<Expense>>> search(
                        @RequestParam String query, Authentication auth) {
                User user = userService.getUserByEmail(auth.getName());
                return naturalSearchService.search(query, user)
                                .thenApply(ResponseEntity::ok);
        }

        // 2. Chat Assistant
        @PostMapping("/chat")
        public CompletableFuture<ResponseEntity<AIResponse>> chat(
                        @RequestBody Map<String, String> body, Authentication auth) {
                String message = body.getOrDefault("message", "").trim();
                User user = userService.getUserByEmail(auth.getName());
                return chatAssistantService.getChatResponse(message, user)
                                .thenApply(ResponseEntity::ok);
        }

        // 3. Voice Expense Parsing
        @PostMapping("/voice-parse")
        public CompletableFuture<ResponseEntity<AIDTOs.VoiceParseResult>> parseVoice(
                        @RequestBody Map<String, String> body) {
                String text = body.getOrDefault("text", "");
                return voiceParsingService.parseVoice(text)
                                .thenApply(ResponseEntity::ok);
        }

        // 4. Smart Approval Recommendation (Manager)
        @GetMapping("/recommendation/{expenseId}")
        public CompletableFuture<ResponseEntity<AIDTOs.ApprovalRecommendation>> getRecommendation(
                        @PathVariable Long expenseId) {
                return expenseRepository.findById(expenseId)
                                .map(expense -> approvalAIService.getRecommendation(expense)
                                                .thenApply(ResponseEntity::ok))
                                .orElse(CompletableFuture.completedFuture(ResponseEntity.notFound().build()));
        }

        // 5. System Status (Ollama Health)
        @GetMapping("/status")
        public ResponseEntity<Map<String, Object>> status() {
                boolean online = ollamaService.isOnline();
                return ResponseEntity.ok(Map.of(
                                "ollamaAvailable", online,
                                "model", online ? ollamaService.getModelName() : "offline"));
        }

        // 6. FAQ Suggesions
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
