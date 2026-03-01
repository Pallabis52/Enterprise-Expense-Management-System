package com.expensemanagement.AI;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class ExternalAIClient {

    private final WebClient webClient;
    private final AIProviderConfig config;
    private final ObjectMapper objectMapper;

    public ExternalAIClient(AIProviderConfig config, ObjectMapper objectMapper) {
        this.config = config;
        this.objectMapper = objectMapper;

        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10_000)
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(60, TimeUnit.SECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(10, TimeUnit.SECONDS)));

        this.webClient = WebClient.builder()
                .baseUrl(config.getBaseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("HTTP-Referer", "https://github.com/Pallabis52/Enterprise-Expense-Management-System")
                .defaultHeader("X-Title", "Enterprise Expense Management System")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    public CompletableFuture<AIResponse> ask(String prompt, String feature) {
        long start = System.currentTimeMillis();

        if (config.getApiKey() == null || config.getApiKey().isBlank()) {
            log.error("EXTERNAL-AI-ERROR: API key is missing for feature: {}", feature);
            return CompletableFuture.completedFuture(AIResponse.fallback(feature, 0));
        }

        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", config.getModel());
        ArrayNode messages = body.putArray("messages");
        ObjectNode userMessage = messages.addObject();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);

        log.debug("EXTERNAL-AI-REQ: {} - Model: {} - Prompt: {}", feature, config.getModel(), prompt);

        return webClient.post()
                .uri("/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + config.getApiKey())
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .timeout(Duration.ofSeconds(60))
                .map(json -> {
                    if (json == null || !json.has("choices")) {
                        log.error("EXTERNAL-AI-ERROR: {} - Invalid response structure or error: {}", feature, json);
                        return AIResponse.fallback(feature, System.currentTimeMillis() - start);
                    }
                    String text = json.path("choices").get(0).path("message").path("content").asText("").trim();
                    long ms = System.currentTimeMillis() - start;
                    log.info("EXTERNAL-AI-SUCCESS: {} [{}ms]", feature, ms);
                    return AIResponse.success(feature, text, config.getModel(), ms);
                })
                .onErrorResume(e -> {
                    log.error("EXTERNAL-AI-API-ERROR: {} - {}", feature, e.getMessage());
                    return Mono.just(AIResponse.fallback(feature, System.currentTimeMillis() - start));
                })
                .toFuture();
    }
}
