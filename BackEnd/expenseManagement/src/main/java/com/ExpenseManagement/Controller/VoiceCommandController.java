package com.expensemanagement.controller;

import com.expensemanagement.AI.VoiceResponse;
import com.expensemanagement.entities.User;
import com.expensemanagement.services.UserService;
import com.expensemanagement.services.VoiceActionService;
import com.expensemanagement.services.VoiceApprovalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Voice command processing — all authenticated roles.
 * POST /api/voice/command
 * POST /api/voice/manager-action
 * GET /api/voice/hints
 */
@Slf4j
@RestController
@RequestMapping("/api/voice")
@RequiredArgsConstructor
public class VoiceCommandController {

    /** Role-gate + full AI/keyword pipeline. */
    private final VoiceActionService voiceActionService;
    private final VoiceApprovalService voiceApprovalService;
    private final UserService userService;

    /**
     * POST /api/voice/command
     * Body: { "transcript": "Show me my pending expenses" }
     * Processes a free-form voice transcript through AI intent detection.
     */
    /**
     * Accepts both {@code text} (spec field) and {@code transcript} (legacy field).
     * {@code text} takes precedence when both are provided.
     */
    @PostMapping("/command")
    public CompletableFuture<ResponseEntity<VoiceResponse>> processCommand(
            @RequestBody Map<String, String> body,
            Authentication auth) {
        // Accept "text" (API spec) or "transcript" (legacy) — whichever is non-blank
        String transcript = body.getOrDefault("text", "").trim();
        if (transcript.isBlank()) {
            transcript = body.getOrDefault("transcript", "").trim();
        }
        if (transcript.isBlank()) {
            return CompletableFuture.completedFuture(
                    ResponseEntity.badRequest().body(VoiceResponse.fallback(0)));
        }
        User user = userService.getUserByEmail(auth.getName());
        log.info("Voice command received from {} : {}", auth.getName(), transcript);
        return voiceActionService.execute(transcript, user)
                .thenApply(ResponseEntity::ok);
    }

    /**
     * POST /api/voice/manager-action
     * Body: { "text": "Approve expense 42" }
     * Specialized fast-path for manager approve/reject commands
     * (no Ollama call needed — rule-based parsing).
     */
    @PostMapping("/manager-action")
    public ResponseEntity<Map<String, String>> managerAction(
            @RequestBody Map<String, String> body,
            Authentication auth) {
        User manager = userService.getUserByEmail(auth.getName());
        String text = body.getOrDefault("text", "");
        String reply = voiceApprovalService.processManagerAction(text, manager);
        return ResponseEntity.ok(Map.of("reply", reply));
    }

    /**
     * GET /api/voice/hints
     * Returns example voice commands for the frontend hint panel.
     */
    @GetMapping("/hints")
    public ResponseEntity<Map<String, List<String>>> getHints(Authentication auth) {
        User user = userService.getUserByEmail(auth.getName());
        String role = user.getRole() != null ? user.getRole().name() : "USER";

        List<String> hints = switch (role) {
            case "MANAGER" -> List.of(
                    "Approve expense 42",
                    "Reject expense 15 reason duplicate",
                    "Show team summary",
                    "Which expenses are risky?",
                    "Show overdue approvals");
            case "ADMIN" -> List.of(
                    "Show fraud alerts",
                    "Generate audit report",
                    "Show budget status for all teams",
                    "Vendor risk analysis",
                    "Show policy insights");
            default -> List.of(
                    "Show my pending expenses",
                    "Add expense 1500 for travel",
                    "How much have I spent this month?",
                    "Search expenses for food",
                    "Chat: explain my spending pattern");
        };

        return ResponseEntity.ok(Map.of("hints", hints, "role", List.of(role)));
    }
}
