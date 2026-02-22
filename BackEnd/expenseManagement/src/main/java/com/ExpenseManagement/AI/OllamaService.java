package com.expensemanagement.AI;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;

import java.time.Duration;
import java.util.concurrent.CompletableFuture;

/**
 * Core service for communicating with the locally-running Ollama server.
 * All calls are non-blocking and fail-safe — if Ollama is offline or times
 * out, a fallback string is returned instead of throwing an exception.
 */
@Slf4j
@Service
public class OllamaService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${ollama.model:deepseek-r1:latest}")
    private String model;

    @Value("${ollama.timeout-seconds:10}")
    private int timeoutSeconds;

    public OllamaService(
            @Value("${ollama.base-url:http://localhost:11434}") String baseUrl,
            ObjectMapper objectMapper) {
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .codecs(cfg -> cfg.defaultCodecs().maxInMemorySize(2 * 1024 * 1024))
                .build();
        this.objectMapper = objectMapper;
    }

    // ─── Async (non-blocking) ───────────────────────────────────────────────

    /**
     * Sends a prompt to DeepSeek and returns the response asynchronously.
     * Falls back to a safe default string if Ollama is unavailable.
     */
    public CompletableFuture<AIResponse> ask(String prompt, String feature) {
        long start = System.currentTimeMillis();

        ObjectNode body = objectMapper.createObjectNode()
                .put("model", model)
                .put("prompt", prompt)
                .put("stream", false);

        return webClient.post()
                .uri("/api/generate")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .timeout(Duration.ofSeconds(timeoutSeconds))
                .map(json -> {
                    String text = json.path("response").asText("").trim();
                    long ms = System.currentTimeMillis() - start;
                    return AIResponse.success(feature, text, model, ms);
                })
                .onErrorResume(ex -> {
                    log.warn("Ollama unavailable for feature '{}': {}", feature, ex.getMessage());
                    long ms = System.currentTimeMillis() - start;
                    return reactor.core.publisher.Mono.just(
                            AIResponse.fallback(feature, ms));
                })
                .toFuture();
    }

    /**
     * Convenience blocking version for simple use cases.
     * Maximum wait = ollama.timeout-seconds + 1s.
     */
    public AIResponse askSync(String prompt, String feature) {
        try {
            return ask(prompt, feature).get(timeoutSeconds + 1L,
                    java.util.concurrent.TimeUnit.SECONDS);
        } catch (Exception e) {
            log.warn("Ollama sync call failed for '{}': {}", feature, e.getMessage());
            return AIResponse.fallback(feature, 0);
        }
    }
}
