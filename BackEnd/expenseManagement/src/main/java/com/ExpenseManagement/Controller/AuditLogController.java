package com.expensemanagement.controller;

import com.expensemanagement.entities.AuditLog;
import com.expensemanagement.services.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Audit log viewer — ADMIN only.
 * GET /api/audit-logs
 */
@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    /** GET /api/audit-logs?page=0&size=20 */
    @GetMapping
    public ResponseEntity<Page<AuditLog>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        return ResponseEntity.ok(auditLogService.getAll(pageable));
    }

    /** GET /api/audit-logs/entity?type=EXPENSE&id=42 */
    @GetMapping("/entity")
    public ResponseEntity<List<AuditLog>> getByEntity(
            @RequestParam String type,
            @RequestParam Long id) {
        return ResponseEntity.ok(auditLogService.getByEntity(type, id));
    }

    /** GET /api/audit-logs/user?username=john@acme.com */
    @GetMapping("/user")
    public ResponseEntity<List<AuditLog>> getByUser(@RequestParam String username) {
        return ResponseEntity.ok(auditLogService.getByUser(username));
    }

    /**
     * GET
     * /api/audit-logs/range?from=2024-01-01T00:00:00&to=2024-01-31T23:59:59&page=0&size=20
     */
    @GetMapping("/range")
    public ResponseEntity<Page<AuditLog>> getByRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        return ResponseEntity.ok(auditLogService.getByDateRange(from, to, pageable));
    }
}
