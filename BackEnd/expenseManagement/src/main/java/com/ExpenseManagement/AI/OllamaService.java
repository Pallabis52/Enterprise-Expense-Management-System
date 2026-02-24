package com.expensemanagement.AI;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * Core service for communicating with the locally-running Ollama server.
 *
 * <p>
 * <b>Reliability features:</b>
 * <ul>
 * <li><b>Warm-up</b> — sends a trivial prompt at startup via {@link #warmUp()}
 * so the model is already loaded in GPU/CPU memory when the first real user
 * request arrives. Controlled by {@code ollama.warmup.enabled}.</li>
 * <li><b>Three-layer timeout</b> — Netty connect
 * ({@code ollama.connect-timeout-seconds}),
 * Netty read/write, and Reactor {@code .timeout()} to guard against every
 * failure mode.</li>
 * <li><b>Retry with back-off</b> — up to {@code ollama.retry.max-attempts}
 * retries on
 * transient Netty / IO errors (NOT on TimeoutException — those are already
 * slow).</li>
 * <li><b>Fail-safe</b> — every error path returns {@link AIResponse#fallback}
 * instead of propagating exceptions to controllers.</li>
 * <li><b>Health check</b> — {@link #isOnline()} probes {@code /api/tags}
 * cheaply (no model load).</li>
 * <li><b>Light-model support</b> — {@link #askLightweight} uses a smaller
 * model for fast, simple tasks (categorize, policy-check).</li>
 * </ul>
 */
@Slf4j
@Service
public class OllamaService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final int connectTimeoutSeconds;

    @Value("${ollama.model:phi3:latest}")
    private String model;

    @Value("${ollama.light-model:phi3:latest}")
    private String lightModel;

    @Value("${ollama.base-url:http://127.0.0.1:11434}")
    private String baseUrl;

    @Value("${ollama.timeout-seconds:90}")
    private int timeoutSeconds;

    @Value("${ollama.warmup.enabled:true}")
    private boolean warmupEnabled;

    @Value("${ollama.retry.max-attempts:2}")
    private int retryMaxAttempts;

    @Value("${ollama.retry.backoff-seconds:3}")
    private long retryBackoffSeconds;

    @Value("${ollama.async.enabled:true}")
    private boolean asyncEnabled;

    public OllamaService(
            @Value("${ollama.base-url:http://127.0.0.1:11434}") String baseUrl,
            @Value("${ollama.timeout-seconds:90}") int timeoutSeconds,
            @Value("${ollama.connect-timeout-seconds:8}") int connectTimeoutSeconds,
            ObjectMapper objectMapper) {

        this.baseUrl = baseUrl;
        this.objectMapper = objectMapper;
        this.timeoutSeconds = timeoutSeconds;
        this.connectTimeoutSeconds = connectTimeoutSeconds;

        // ── Netty-level timeouts ──────────────────────────────────────────────
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, connectTimeoutSeconds * 1_000)
                .doOnConnected(conn -> conn
                        // Netty read handler: model response window + 10 s buffer
                        .addHandlerLast(new ReadTimeoutHandler(timeoutSeconds + 10, TimeUnit.SECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(10, TimeUnit.SECONDS)));

        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .codecs(cfg -> cfg.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();
    }

    // ─── Warm-up ─────────────────────────────────────────────────────────────

    /**
     * Sends a trivial prompt to Ollama right after Spring context starts.
     * Pre-loads the model into memory so the first real user request does not
     * pay the full cold-start penalty (can be 90–180 s for 8B models on CPU).
     *
     * <p>
     * Runs in a detached thread so it never delays application startup.
     * Errors are swallowed — if Ollama is offline at startup, warm-up is skipped.
     */
    @PostConstruct
    public void warmUp() {
        if (!warmupEnabled) {
            log.info("AI Service — warm-up disabled.");
            return;
        }
        log.info("AI Service — pre-loading model '{}' (target: {})", model, baseUrl);
        CompletableFuture.runAsync(() -> {
            try {
                ObjectNode body = objectMapper.createObjectNode()
                        .put("model", model)
                        .put("prompt", "Hi")
                        .put("stream", false)
                        .put("keep_alive", "5m");

                webClient.post()
                        .uri("/api/generate")
                        .bodyValue(body)
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .timeout(Duration.ofSeconds(180))
                        .doOnSuccess(r -> log.info("AI Service — model '{}' is online and warm ✓", model))
                        .doOnError(e -> log.warn("AI Service — warm-up failed for model '{}' at {}: {}",
                                model, baseUrl, e.getMessage()))
                        .onErrorResume(e -> Mono.empty())
                        .subscribe();
            } catch (Exception e) {
                log.warn("AI Service — setup error: {}", e.getMessage());
            }
        });
    }

    public String getModelName() {
        return this.model;
    }

    // ─── Health check ─────────────────────────────────────────────────────────

    /**
     * Checks whether Ollama is currently reachable by calling
     * {@code GET /api/tags}.
     * This endpoint is lightweight (no model inference) and returns in
     * milliseconds — safe to call from health-check / status endpoints.
     *
     * @return {@code true} if Ollama responded successfully, {@code false}
     *         otherwise
     */
    public boolean isOnline() {
        try {
            log.debug("Checking AI health at {}/api/tags", baseUrl);
            JsonNode response = webClient.get()
                    .uri("/api/tags")
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .timeout(Duration.ofSeconds(Math.max(2, connectTimeoutSeconds)))
                    .block();
            return response != null && response.has("models");
        } catch (Exception e) {
            log.warn("AI Health Check — Service at {} unreachable: {}", baseUrl, e.getMessage());
            return false;
        }
    }

    // ─── Core async ask ──────────────────────────────────────────────────────

    /**
     * Sends a prompt to Ollama using the <b>primary model</b> and returns the
     * response asynchronously.
     *
     * <p>
     * Falls back to a safe {@link AIResponse#fallback} if Ollama is
     * unavailable, times out, or returns an error — the caller never needs
     * to handle exceptions.
     *
     * @param prompt  the full prompt string
     * @param feature logical feature name for logging and fallback messages
     * @return a non-null {@link CompletableFuture} that always completes
     */
    public CompletableFuture<AIResponse> ask(String prompt, String feature) {
        return doAsk(prompt, feature, model);
    }

    /**
     * Sends a prompt to Ollama using the <b>lightweight model</b>.
     * Use this for simple classification tasks (categorize, policy-check) where
     * a smaller model is fast enough and saves GPU memory pressure.
     */
    public CompletableFuture<AIResponse> askLightweight(String prompt, String feature) {
        return doAsk(prompt, feature, lightModel);
    }

    // ─── Blocking convenience ────────────────────────────────────────────────

    /**
     * Blocking wrapper around {@link #ask}.
     * Waits at most {@code timeoutSeconds + 30} seconds before returning a
     * fallback — the caller is never blocked indefinitely.
     *
     * <p>
     * <b>Prefer the async {@link #ask} in new code</b>; this method exists
     * only for backward compatibility with existing synchronous call sites.
     */
    public AIResponse askSync(String prompt, String feature) {
        try {
            return ask(prompt, feature).get(timeoutSeconds + 30L, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.warn("OllamaService sync call failed for '{}': {}", feature, e.getMessage());
            return AIResponse.fallback(feature, 0);
        }
    }

    /**
     * Blocking wrapper around {@link #askLightweight}.
     */
    public AIResponse askLightweightSync(String prompt, String feature) {
        try {
            return askLightweight(prompt, feature).get(timeoutSeconds + 30L, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.warn("OllamaService lightweight sync call failed for '{}': {}", feature, e.getMessage());
            return AIResponse.fallback(feature, 0);
        }
    }

    // ─── Private implementation ───────────────────────────────────────────────

    private CompletableFuture<AIResponse> doAsk(String prompt, String feature, String modelName) {
        long start = System.currentTimeMillis();

        ObjectNode body = objectMapper.createObjectNode()
                .put("model", modelName)
                .put("prompt", prompt)
                .put("stream", false);

        if (!asyncEnabled) {
            log.debug("Ollama async disabled — executing sync call for {}", feature);
            try {
                JsonNode response = webClient.post()
                        .uri("/api/generate")
                        .bodyValue(body)
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .timeout(Duration.ofSeconds(timeoutSeconds))
                        .block();

                long ms = System.currentTimeMillis() - start;
                if (response != null) {
                    String text = response.path("response").asText("").trim();
                    return CompletableFuture.completedFuture(AIResponse.success(feature, text, modelName, ms));
                }
                return CompletableFuture.completedFuture(AIResponse.fallback(feature, ms));
            } catch (Exception ex) {
                long ms = System.currentTimeMillis() - start;
                log.warn("Ollama Sync Fallback failed for '{}': {}", feature, ex.getMessage());
                return CompletableFuture.completedFuture(AIResponse.fallback(feature, ms));
            }
        }

        return webClient.post()
                .uri("/api/generate")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                // ── Reactor-level timeout (primary guard) ───────────────────
                .timeout(Duration.ofSeconds(timeoutSeconds))
                // ── Retry: back-off on transient IO errors, NOT on timeout ──
                // TimeoutException means the model is slow — retrying would
                // just queue another 120-second wait. Retry only on network
                // errors (connection reset, Netty read timeout, HTTP 5xx).
                .retryWhen(Retry.backoff(retryMaxAttempts, Duration.ofSeconds(retryBackoffSeconds))
                        .filter(this::isRetryable)
                        .doBeforeRetry(signal -> log.warn(
                                "OllamaService '{}' — retrying after transient error (attempt {}): {}",
                                feature, signal.totalRetries() + 1, signal.failure().getMessage())))
                .map(json -> {
                    if (json == null) {
                        return AIResponse.fallback(feature, System.currentTimeMillis() - start);
                    }
                    String text = json.path("response").asText("").trim();
                    long ms = System.currentTimeMillis() - start;
                    log.debug("AI Success '{}' — {}ms via {}", feature, ms, modelName);
                    return AIResponse.success(feature, text, modelName, ms);
                })
                .onErrorResume(Throwable.class, ex -> {
                    long ms = System.currentTimeMillis() - start;
                    // ── Structured error logging ─────────────────────────────
                    if (ex instanceof TimeoutException || ex.getCause() instanceof TimeoutException) {
                        log.warn("OllamaService '{}' TIMEOUT after {}ms — model '{}' did not respond within {}s. " +
                                "Tip: increase ollama.timeout-seconds or ensure the model is warm.",
                                feature, ms, modelName, timeoutSeconds);
                    } else if (ex instanceof WebClientResponseException httpEx) {
                        String errorBody = httpEx.getResponseBodyAsString();
                        log.warn("OllamaService '{}' HTTP {} after {}ms — Body: {}",
                                feature, httpEx.getStatusCode().value(), ms, errorBody);
                    } else {
                        log.warn("OllamaService '{}' failed after {}ms — {}: {}",
                                feature, ms, ex.getClass().getSimpleName(), ex.getMessage());
                    }
                    return Mono.just(AIResponse.fallback(feature, ms));
                })
                .toFuture();
    }

    /**
     * Returns {@code true} for errors that are safe to retry (transient network /
     * server errors). TimeoutException is excluded — retrying a timed-out call
     * would just pile on another full timeout wait.
     */
    private boolean isRetryable(Throwable ex) {
        if (ex instanceof TimeoutException)
            return false;
        if (ex.getCause() instanceof TimeoutException)
            return false;
        // Retry on HTTP 5xx (e.g. Ollama still loading) and IO errors
        if (ex instanceof WebClientResponseException httpEx) {
            return httpEx.getStatusCode().is5xxServerError();
        }
        // Retry on Netty IO exceptions (connection reset, read timeout at Netty layer)
        return ex.getClass().getName().startsWith("io.netty")
                || ex instanceof java.io.IOException;
    }
}
