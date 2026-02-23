package com.expensemanagement.AI;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Enables Spring's caching abstraction backed by Caffeine (in-memory, no Redis
 * needed).
 *
 * <p>
 * Cache: {@code "ai-results"}
 * <ul>
 * <li>Maximum 200 entries — covers typical concurrent session count
 * <li>5-minute write-expiry — stale enough to be useful, fresh enough for
 * expense data
 * </ul>
 *
 * <p>
 * To cache a method, annotate it with:
 * 
 * <pre>{@code @Cacheable(value = "ai-results", key = "#root.methodName + ':' + #paramKey")}</pre>
 */
@Configuration
@EnableCaching
public class AICacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager("ai-results");
        manager.setCaffeine(
                Caffeine.newBuilder()
                        .maximumSize(200)
                        .expireAfterWrite(5, TimeUnit.MINUTES)
                        .recordStats() // visible in logs at DEBUG level
        );
        return manager;
    }
}
