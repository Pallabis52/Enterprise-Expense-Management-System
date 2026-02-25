package com.expensemanagement.Controller;

import com.expensemanagement.AI.VoiceResponse;
import com.expensemanagement.Entities.User;
import com.expensemanagement.Services.UserService;
import com.expensemanagement.Services.VoiceIntentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Voice command controller — accessible to all authenticated roles.
 *
 * POST /api/voice/command — main voice processing endpoint
 * GET /api/voice/hints — returns role-specific example phrases for the UI
 */
@Slf4j
@RestController
@RequestMapping("/api/voice")
@RequiredArgsConstructor
public class VoiceCommandController {

        private final VoiceIntentService voiceIntentService;
        private final UserService userService;
        private final VoiceApprovalService voiceApprovalService;

        /**
         * Main voice command endpoint.
         *
         * Request body:
         * {
         * "text": "show my pending travel expenses",
         * "context": "(optional additional context)"
         * }
         *
         * Response: VoiceResponse { intent, params, reply, data, fallback, processingMs
         * }
         */
        @PostMapping("/command")
        public CompletableFuture<ResponseEntity<VoiceResponse>> command(
                        @RequestBody Map<String, String> body,
                        Authentication auth) {

                String text = body.getOrDefault("text", "").trim();

                if (text.isBlank()) {
                        return CompletableFuture.completedFuture(ResponseEntity.ok(
                                        VoiceResponse.builder()
                                                        .intent("UNKNOWN")
                                                        .params(Map.of())
                                                        .reply("I didn't catch that. Please try speaking again.")
                                                        .fallback(true)
                                                        .processingMs(0)
                                                        .build()));
                }

                try {
                        User user = userService.getUserByEmail(auth.getName());
                        log.info("Voice command received from user={} text=\"{}\"", user.getEmail(), text);

                        return voiceIntentService.resolveAsync(text, user)
                                        .thenApply(ResponseEntity::ok)
                                        .exceptionally(ex -> {
                                                log.error("Voice command failed for user={}: {}", auth.getName(),
                                                                ex.getMessage(), ex);
                                                return ResponseEntity.ok(VoiceResponse.builder()
                                                                .intent("UNKNOWN")
                                                                .params(Map.of())
                                                                .reply("I couldn't process that command right now. Please try again.")
                                                                .fallback(true)
                                                                .processingMs(0)
                                                                .build());
                                        });
                } catch (Exception ex) {
                        log.error("Voice command setup failed for user={}: {}", auth.getName(), ex.getMessage(), ex);
                        return CompletableFuture.completedFuture(ResponseEntity.ok(
                                        VoiceResponse.builder()
                                                        .intent("UNKNOWN")
                                                        .params(Map.of())
                                                        .reply("Something went wrong. Please try again.")
                                                        .fallback(true)
                                                        .processingMs(0)
                                                        .build()));
                }
        }

        /**
         * Manager Voice Approval/Rejection.
         * Only accessible by ROLE_MANAGER.
         */
        @PostMapping("/manager-action")
        @org.springframework.security.access.prepost.PreAuthorize("hasRole('MANAGER')")
        public ResponseEntity<Map<String, String>> managerAction(
                        @RequestBody Map<String, String> body,
                        Authentication auth) {
                String text = body.getOrDefault("text", "");
                User user = userService.getUserByEmail(auth.getName());
                String reply = voiceApprovalService.processManagerAction(text, user);
                return ResponseEntity.ok(Map.of("reply", reply));
        }

        /**
         * Returns role-specific example phrases shown in the VoiceButton hint panel.
         * GET /api/voice/hints
         */
        @GetMapping("/hints")
        public ResponseEntity<Map<String, Object>> hints(Authentication auth) {
                User user = userService.getUserByEmail(auth.getName());
                String role = user.getRole() != null ? user.getRole().name() : "USER";

                List<String> examples = switch (role) {
                        case "ADMIN" -> List.of(
                                        "Which teams exceeded their budget this month?",
                                        "Run fraud detection on recent expenses",
                                        "Show vendor ROI analysis",
                                        "What is the budget status for Engineering?");
                        case "MANAGER" -> List.of(
                                        "Show my team's pending expenses",
                                        "Approve expense 15",
                                        "Reject expense 22, reason: missing receipt",
                                        "Summarize my team's spending this month");
                        default -> List.of(
                                        "Show my pending expenses",
                                        "Show my rejected travel expenses",
                                        "What is my approval status?",
                                        "Add expense for taxi 500 rupees travel",
                                        "Give me my spending summary");
                };

                return ResponseEntity.ok(Map.of(
                                "role", role,
                                "hints", examples,
                                "tip", "Speak clearly and mention key terms like category, amount, or expense ID."));
        }
}
