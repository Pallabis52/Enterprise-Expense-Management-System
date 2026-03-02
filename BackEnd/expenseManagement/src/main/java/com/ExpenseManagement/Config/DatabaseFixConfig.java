package com.expensemanagement.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Configuration to handle database-level fixes that Hibernate's ddl-auto=update
 * might struggle with, such as modifying or dropping legacy CHECK constraints
 * when enum values are added.
 */
@Slf4j
@Configuration
public class DatabaseFixConfig {

    @Bean
    public CommandLineRunner dropProblematicConstraints(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                log.info("DATABASE-FIX: Attempting to drop restrictive CHECK constraints...");

                // 1. Drop the status constraint on complaints table to allow new status
                // 'ESCALATED'
                // Hibernate sometimes generates these automatically in some PostgreSQL versions
                // and fails to update them when the enum changes.
                jdbcTemplate.execute("ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_status_check");

                log.info("DATABASE-FIX: Successfully dropped complaints_status_check constraint.");

            } catch (Exception e) {
                log.warn("DATABASE-FIX: Non-critical error while dropping constraints: {}. " +
                        "This usually means the constraint was already removed or doesn't exist.", e.getMessage());
            }
        };
    }
}
