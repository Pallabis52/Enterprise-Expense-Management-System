package com.expensemanagement.Services;

import com.expensemanagement.AI.OllamaService;
import com.expensemanagement.DTO.AIDTOs;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class VoiceParsingService {

    private final OllamaService ollamaService;
    private final ObjectMapper objectMapper;

    public CompletableFuture<AIDTOs.VoiceParseResult> parseVoice(String text) {
        String prompt = String.format(
                "Extract expense details (amount, category, description) from this text.\n" +
                        "Text: \"%s\"\n" +
                        "Return ONLY JSON.\n" +
                        "Categories: travel, meals, supplies, software, other.\n" +
                        "Example: {\"amount\": 500.0, \"category\": \"travel\", \"description\": \"Taxi to airport\"}",
                text);

        return ollamaService.ask(prompt, "voice-parsing")
                .thenApply(aiResponse -> {
                    if (aiResponse.isFallback()) {
                        return AIDTOs.VoiceParseResult.builder()
                                .description(text)
                                .category("other")
                                .build();
                    }

                    try {
                        String json = extractJson(aiResponse.getResult());
                        AIDTOs.VoiceParseResult result = objectMapper.readValue(json, AIDTOs.VoiceParseResult.class);
                        if (result.getAmount() == null)
                            throw new Exception("Amount missing");
                        if (result.getCategory() == null)
                            result.setCategory("other");
                        return result;
                    } catch (Exception e) {
                        log.error("Failed to parse voice JSON: {}", e.getMessage());
                        return AIDTOs.VoiceParseResult.builder()
                                .description(text)
                                .category("other")
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
