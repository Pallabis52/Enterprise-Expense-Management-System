package com.expensemanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class DebugController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/db-check")
    public Map<String, Object> checkDb() {
        try {
            List<String> tables = jdbcTemplate.queryForList(
                    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'", String.class);

            boolean complaintsExist = tables.contains("complaints");

            Object tableStructure = null;
            if (complaintsExist) {
                tableStructure = jdbcTemplate.queryForList(
                        "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'complaints'");
            }

            return Map.of(
                    "status", "CONNECTED",
                    "tables", tables,
                    "complaints_table_exists", complaintsExist,
                    "complaints_structure", tableStructure != null ? tableStructure : "NOT_FOUND");
        } catch (Exception e) {
            return Map.of("status", "ERROR", "message", e.getMessage());
        }
    }
}
