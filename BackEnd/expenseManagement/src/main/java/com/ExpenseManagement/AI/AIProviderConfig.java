package com.expensemanagement.AI;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Slf4j
@Configuration
@Getter
public class AIProviderConfig {

    public enum Provider {
        OLLAMA, OPENROUTER
    }

    @Value("${ai.provider:OPENROUTER}")
    private String rawProvider;

    @Value("${ai.api-key:}")
    private String apiKey;

    @Value("${ai.base-url:https://openrouter.ai/api/v1}")
    private String baseUrl;

    @Value("${ai.model:google/gemini-2.0-flash-001}")
    private String model;

    private Provider provider;

    @PostConstruct
    public void init() {
        try {
            this.provider = Provider.valueOf(rawProvider.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid AI_PROVIDER '{}'. Falling back to OPENROUTER.", rawProvider);
            this.provider = Provider.OPENROUTER;
        }

        log.info("AI Provider initialized: {}", provider);
        if (provider == Provider.OPENROUTER && (apiKey == null || apiKey.isBlank())) {
            log.warn(
                    "AI_API_KEY is missing for OPENROUTER provider. AI features may fail or fallback to local Ollama.");
        }
    }

    public boolean isExternal() {
        return provider == Provider.OPENROUTER;
    }
}
