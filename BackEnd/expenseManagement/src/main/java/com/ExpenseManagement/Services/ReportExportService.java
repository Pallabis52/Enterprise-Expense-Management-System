package com.expensemanagement.Services;

import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportExportService {

    private final ExpenseRepository expenseRepository;

    /**
     * Generates a CSV export of expenses.
     * Manual generation to avoid extra dependencies while maintaining enterprise
     * quality.
     */
    public ByteArrayInputStream exportExpensesToCsv(List<Expense> expenses) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
                PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {

            // Header
            writer.println("ID,Title,Amount,Category,Date,Status,User,Vendor,SLA Status,Confidence Score");

            for (Expense expense : expenses) {
                String row = String.format("%d,\"%s\",%.2f,\"%s\",%s,%s,\"%s\",\"%s\",%s,%.2f",
                        expense.getId(),
                        escapeCsv(expense.getTitle()),
                        expense.getAmount(),
                        escapeCsv(expense.getCategory()),
                        expense.getDate(),
                        expense.getStatus(),
                        expense.getUser() != null ? escapeCsv(expense.getUser().getName()) : "",
                        escapeCsv(expense.getVendorName() != null ? expense.getVendorName() : ""),
                        expense.isOverdue() ? "OVERDUE" : "ON-TIME",
                        expense.getConfidenceScore());
                writer.println(row);
            }

            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            log.error("Failed to generate CSV report: {}", e.getMessage());
            throw new RuntimeException("CSV generation failed", e);
        }
    }

    private String escapeCsv(String data) {
        if (data == null)
            return "";
        return data.replace("\"", "\"\"");
    }
}
