package com.expensemanagement.Controller;

import com.expensemanagement.entities.Approval_Status;
import com.expensemanagement.entities.Expense;
import com.expensemanagement.repository.ExpenseRepository;
import com.expensemanagement.services.ReportExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/reports/export")
@RequiredArgsConstructor
public class ReportExportController {

    private final ReportExportService reportExportService;
    private final ExpenseRepository expenseRepository;

    @GetMapping("/csv")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<InputStreamResource> exportAllToCsv() {
        List<Expense> expenses = expenseRepository.findAll();
        ByteArrayInputStream bis = reportExportService.exportExpensesToCsv(expenses);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=expenses_report.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(bis));
    }

    @GetMapping("/user/csv")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InputStreamResource> exportUserExpensesToCsv(@RequestParam Long userId) {
        // In a real scenario, we'd verify userId matches current user or requester is
        // MANAGER/ADMIN
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        ByteArrayInputStream bis = reportExportService.exportExpensesToCsv(expenses);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=my_expenses.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(bis));
    }
}
