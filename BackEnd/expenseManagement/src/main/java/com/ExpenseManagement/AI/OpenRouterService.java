package com.expensemanagement.AI;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class OpenRouterService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;
    private final int timeoutSeconds;

    // Concurrency Gate to prevent overwhelming the external API
    private final Semaphore concurrencyGate = new Semaphore(5);

    public OpenRouterService(
            @Value("${openrouter.base-url:https://openrouter.ai/api/v1}") String baseUrl,
            @Value("${openrouter.api.key}") String apiKey,
            @Value("${openrouter.model:google/gemini-2.0-flash-001}") String model,
            @Value("${openrouter.timeout-seconds:60}") int timeoutSeconds,
            @Value("${openrouter.connect-timeout-seconds:10}") int connectTimeoutSeconds,
            ObjectMapper objectMapper) {

        this.apiKey = apiKey;
        this.model = model;
        this.objectMapper = objectMapper;
        this.timeoutSeconds = timeoutSeconds;

        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, connectTimeoutSeconds * 1_000)
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(timeoutSeconds + 5, TimeUnit.SECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(10, TimeUnit.SECONDS)));

        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("HTTP-Referer", "https://github.com/Pallabis52/Enterprise-Expense-Management-System")
                .defaultHeader("X-Title", "Enterprise Expense Management System")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    public CompletableFuture<AIResponse> ask(String prompt, String feature) {
        return doAsk(prompt, feature);
    }

    public CompletableFuture<AIResponse> askLightweight(String prompt, String feature) {
        return doAsk(prompt, feature); // With OpenRouter, we use the same model or configure a cheaper one
    }

    private CompletableFuture<AIResponse> doAsk(String prompt, String feature) {
        long start = System.currentTimeMillis();

        // Build OpenAI-compatible chat completion body
        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", model);

        ArrayNode messages = body.putArray("messages");
        ObjectNode userMessage = messages.addObject();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);

        return CompletableFuture.supplyAsync(() -> {
            try {
                if (!concurrencyGate.tryAcquire(20, TimeUnit.SECONDS)) {
                    log.warn("AI Overload — request '{}' timed out waiting for slot", feature);
                    return AIResponse.fallback(feature, System.currentTimeMillis() - start);
                }

                try {
                    return webClient.post()
                            .uri("/chat/completions")
                            .bodyValue(body)
                            .retrieve()
                            .bodyToMono(JsonNode.class)
                            .timeout(Duration.ofSeconds(timeoutSeconds))
                            .map(json -> {
                                if (json == null || !json.has("choices")) {
                                    log.error("OpenRouter Error: Invalid response structure");
                                    return AIResponse.fallback(feature, System.currentTimeMillis() - start);
                                }
                                String text = json.path("choices").get(0).path("message").path("content").asText("")
                                        .trim();
                                long ms = System.currentTimeMillis() - start;
                                log.info("OPENROUTER-SUCCESS: {} [{}ms]", feature, ms);
                                return AIResponse.success(feature, text, model, ms);
                            })
                            .onErrorResume(e -> {
                                log.error("OpenRouter API Error: {}", e.getMessage());
                                return Mono.just(AIResponse.fallback(feature, System.currentTimeMillis() - start));
                            })
                            .block();
                } finally {
                    concurrencyGate.release();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return AIResponse.fallback(feature, System.currentTimeMillis() - start);
            }
        });
    }

    public AIResponse askSync(String prompt, String feature) {
        try {
            return ask(prompt, feature).get(timeoutSeconds + 10L, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.warn("OpenRouterService sync call failed for '{}': {}", feature, e.getMessage());
            return AIResponse.fallback(feature, 0);
        }
    }

    public boolean isOnline() {
        // Simple health check for OpenRouter could be checking a public endpoint
        return true;
    }

    public String getModelName() {
        return this.model;
    }
}
