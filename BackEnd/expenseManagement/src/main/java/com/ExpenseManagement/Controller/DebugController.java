package com.expensemanagement.controller;

import com.expensemanagement.repository.ExpenseRepository;
import com.expensemanagement.repository.UserRepository;
import com.expensemanagement.services.FreezePeriodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Developer/debug utilities — ADMIN only.
 * Useful for health-checks and sanity testing.
 * GET /api/debug/*
 */
@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class DebugController {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final FreezePeriodService freezePeriodService;

    /** GET /api/debug/stats — quick DB row counts */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        return ResponseEntity.ok(Map.of(
                "expenses", expenseRepository.count(),
                "users", userRepository.count(),
                "frozen", freezePeriodService.isCurrentMonthFrozen()));
    }

    /** GET /api/debug/freeze-status */
    @GetMapping("/freeze-status")
    public ResponseEntity<Map<String, Object>> freezeStatus() {
        return ResponseEntity.ok(Map.of(
                "isCurrentMonthFrozen", freezePeriodService.isCurrentMonthFrozen(),
                "allPeriods", freezePeriodService.getAllFreezePeriods()));
    }
}
