package com.expensemanagement.services;

import com.expensemanagement.entities.Expense;
import com.expensemanagement.entities.User;
import com.expensemanagement.repository.ExpenseRepository;
import com.expensemanagement.repository.UserRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Stream;
import java.awt.Color;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public byte[] generateUserExpenseExcel(Long userId) throws IOException {
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        return generateExcel(expenses, "User Expenses");
    }

    public byte[] generateTeamExpenseExcel(Long managerId) throws IOException {
        User manager = userRepository.findById(managerId).orElseThrow(() -> new RuntimeException("Manager not found"));
        // Team lookup: A manager manages a team which has members.
        if (manager.getManagedTeam() == null) {
            return generateExcel(List.of(), "Team Expenses");
        }
        List<User> members = manager.getManagedTeam().getMembers();
        if (members == null || members.isEmpty()) {
            return generateExcel(List.of(), "Team Expenses");
        }
        List<Expense> expenses = expenseRepository.findByUserIn(members, Pageable.unpaged()).getContent();
        return generateExcel(expenses, "Team Expenses");
    }

    public byte[] generateAuditPdf() throws IOException {
        List<Expense> expenses = expenseRepository.findAll();
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            font.setSize(18);
            Paragraph p = new Paragraph("Enterprise System Audit Report", font);
            p.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(p);

            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100f);
            table.setSpacingBefore(10);

            writeTableHeader(table);
            writeTableData(table, expenses);

            document.add(table);
            document.close();
            return out.toByteArray();
        }
    }

    private byte[] generateExcel(List<Expense> expenses, String sheetName) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(sheetName);

            // Header
            Row headerRow = sheet.createRow(0);
            String[] columns = { "ID", "Title", "Amount", "Category", "Date", "Status", "User" };

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data
            int rowIdx = 1;
            for (Expense expense : expenses) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(expense.getId() != null ? expense.getId() : 0L);
                row.createCell(1).setCellValue(expense.getTitle() != null ? expense.getTitle() : "N/A");
                row.createCell(2).setCellValue(expense.getAmount());
                row.createCell(3).setCellValue(expense.getCategory() != null ? expense.getCategory() : "N/A");
                row.createCell(4).setCellValue(expense.getDate() != null ? expense.getDate().toString() : "");
                row.createCell(5).setCellValue(expense.getStatus() != null ? expense.getStatus().toString() : "");
                row.createCell(6).setCellValue(expense.getUser() != null && expense.getUser().getName() != null
                        ? expense.getUser().getName()
                        : "Unknown");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.DARK_GRAY);
        cell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.WHITE);

        Stream.of("ID", "User", "Amount", "Category", "Date", "Status")
                .forEach(columnTitle -> {
                    cell.setPhrase(new Phrase(columnTitle, font));
                    table.addCell(cell);
                });
    }

    private void writeTableData(PdfPTable table, List<Expense> expenses) {
        for (Expense expense : expenses) {
            table.addCell(String.valueOf(expense.getId() != null ? expense.getId() : "N/A"));
            table.addCell(expense.getUser() != null && expense.getUser().getName() != null
                    ? expense.getUser().getName()
                    : "N/A");
            table.addCell(String.valueOf(expense.getAmount()));
            table.addCell(expense.getCategory() != null ? expense.getCategory() : "N/A");
            table.addCell(expense.getDate() != null ? expense.getDate().toString() : "");
            table.addCell(expense.getStatus() != null ? expense.getStatus().toString() : "");
        }
    }
}
