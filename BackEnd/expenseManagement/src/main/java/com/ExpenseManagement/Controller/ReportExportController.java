package com.expensemanagement.controller;

import com.expensemanagement.entities.Expense;
import com.expensemanagement.services.ExpenseService;
import com.expensemanagement.services.ReportExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * CSV report export endpoint — ADMIN only.
 * GET /api/reports/export/csv
 */
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportExportController {

    private final ReportExportService reportExportService;
    private final ExpenseService expenseService;

    /**
     * GET /api/reports/export/csv?month=1&year=2025
     * Streams a CSV file download of all (or monthly) expenses.
     */
    @GetMapping("/export/csv")
    public ResponseEntity<InputStreamResource> exportCsv(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        List<Expense> expenses;
        if (month != null && year != null) {
            expenses = expenseService.getbymonthandyear(month, year);
        } else {
            expenses = expenseService.getallExpenses();
        }

        var csvStream = reportExportService.exportExpensesToCsv(expenses);
        String filename = "expenses_" + LocalDate.now() + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(csvStream));
    }

    /**
     * GET /api/reports/export/csv/month?month=1&year=2025
     * Alias for monthly export — used by admin frontend report page.
     */
    @GetMapping("/export/csv/month")
    public ResponseEntity<InputStreamResource> exportMonthCsv(
            @RequestParam int month,
            @RequestParam int year) {
        List<Expense> expenses = expenseService.getbymonthandyear(month, year);
        var csvStream = reportExportService.exportExpensesToCsv(expenses);
        String filename = "expenses_" + year + "_" + month + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(csvStream));
    }
}
