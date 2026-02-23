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
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VoiceCommandController {

    private final VoiceIntentService voiceIntentService;
    private final UserService userService;

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
    public ResponseEntity<VoiceResponse> command(
            @RequestBody Map<String, String> body,
            Authentication auth) {

        String text = body.getOrDefault("text", "").trim();

        if (text.isBlank()) {
            return ResponseEntity.badRequest().body(
                    VoiceResponse.builder()
                            .intent("UNKNOWN")
                            .params(Map.of())
                            .reply("I didn't catch that. Please try speaking again.")
                            .fallback(true)
                            .processingMs(0)
                            .build());
        }

        User user = userService.getUserByEmail(auth.getName());
        log.info("Voice command received from user={} text=\"{}\"", user.getEmail(), text);

        VoiceResponse response = voiceIntentService.resolve(text, user);
        return ResponseEntity.ok(response);
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
