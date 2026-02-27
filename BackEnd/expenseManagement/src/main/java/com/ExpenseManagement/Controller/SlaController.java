package com.expensemanagement.controller;

import com.expensemanagement.entities.Expense;
import com.expensemanagement.services.SlaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * SLA (Service Level Agreement) monitoring — MANAGER, ADMIN.
 * GET /api/sla/*
 */
@RestController
@RequestMapping("/api/sla")
@RequiredArgsConstructor
public class SlaController {

    private final SlaService slaService;

    /** GET /api/sla/overdue — returns all overdue pending expenses */
    @GetMapping("/overdue")
    public ResponseEntity<List<Expense>> getOverdue() {
        return ResponseEntity.ok(slaService.getOverdueExpenses());
    }

    /** POST /api/sla/check — manually trigger overdue check (admin use) */
    @PostMapping("/check")
    public ResponseEntity<Map<String, String>> triggerCheck() {
        slaService.checkOverdueApprovals();
        return ResponseEntity.ok(Map.of("message", "SLA check triggered successfully"));
    }
}
