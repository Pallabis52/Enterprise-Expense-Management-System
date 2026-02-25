package com.expensemanagement.Controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Services.ApprovalService;
import com.expensemanagement.Services.ExpenseService;
import com.expensemanagement.Services.FileService;
import com.expensemanagement.Services.ReceiptStorageService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/expenses")
@Tag(name = "ExpenseController", description = "for testing apis")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final FileService fileService;
    private final ApprovalService approvalService;
    private final ReceiptStorageService receiptStorageService;
    private final com.expensemanagement.Repository.UserRepository userRepository;
    private final com.expensemanagement.Repository.ExpenseRepository expenseRepository;
    private final com.expensemanagement.Services.UserService userService;
    private final com.expensemanagement.Services.CategorySuggestionService categorySuggestionService;
    private final com.expensemanagement.Services.ExpenseSplitService expenseSplitService;

    // --- Receipt Upload & Viewing ---

    // POST /api/expenses/{id}/upload-receipt
    @Operation(summary = "Upload a receipt for an expense")
    @PostMapping("/{id}/upload-receipt")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> uploadReceipt(@PathVariable Long id, @RequestParam("file") MultipartFile file,
            org.springframework.security.core.Authentication auth) {
        Expense expense = expenseService.getById(id);
        if (expense == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found");
        }

        // Validate Ownership
        if (!expense.getUser().getEmail().equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only upload receipts for your own expenses");
        }

        String filename = receiptStorageService.store(file);
        expense.setReceiptUrl(filename);

        // Save using repository directly to bypass service-level notifications/AI
        // checks
        expenseRepository.save(expense);

        return ResponseEntity.ok(java.util.Map.of("message", "Receipt uploaded successfully", "filename", filename));
    }

    // GET /api/expenses/{id}/receipt
    @Operation(summary = "View a receipt for an expense")
    @GetMapping("/{id}/receipt")
    public ResponseEntity<?> viewReceipt(@PathVariable Long id, org.springframework.security.core.Authentication auth) {
        Expense expense = expenseService.getById(id);
        if (expense == null || expense.getReceiptUrl() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Receipt not found");
        }

        String currentUserEmail = auth.getName();
        com.expensemanagement.Entities.User currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow();
        String role = currentUser.getRole().name();

        boolean authorized = false;

        // USER -> only own
        if ("USER".equals(role)) {
            if (expense.getUser().getEmail().equals(currentUserEmail)) {
                authorized = true;
            }
        }
        // MANAGER -> team members
        else if ("MANAGER".equals(role)) {
            // Check if expense owner is in manager's team
            com.expensemanagement.Entities.User expenseOwner = expense.getUser();
            if (expenseOwner.getTeam() != null && expenseOwner.getTeam().getManager() != null
                    && expenseOwner.getTeam().getManager().getEmail().equals(currentUserEmail)) {
                authorized = true;
            } else if (expenseOwner.getEmail().equals(currentUserEmail)) {
                authorized = true;
            }
        }
        // ADMIN -> all
        else if ("ADMIN".equals(role)) {
            authorized = true;
        }

        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to view this receipt");
        }

        org.springframework.core.io.Resource file = receiptStorageService.load(expense.getReceiptUrl());
        String contentType = "application/octet-stream";
        try {
            contentType = org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()
                    .toString().contains("pdf") ? "application/pdf" : "image/jpeg";
            // Simple content type detection based on extension
            String filename = file.getFilename();
            if (filename != null) {
                if (filename.toLowerCase().endsWith(".pdf"))
                    contentType = "application/pdf";
                else if (filename.toLowerCase().endsWith(".png"))
                    contentType = "image/png";
                else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg"))
                    contentType = "image/jpeg";
            }
        } catch (Exception e) {
            // fallback
        }

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    // localhost:8080/api/expenses/draft
    @Operation(summary = "Save expense as draft")
    @PostMapping("/draft")
    public ResponseEntity<?> saveDraft(@RequestBody Expense expense) {
        Expense saved = expenseService.saveDraft(expense);
        return ResponseEntity.ok(saved);
    }

    // localhost:8080/api/expenses/{id}/submit
    @Operation(summary = "Submit a draft expense")
    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitDraft(@PathVariable Long id) {
        Expense submitted = expenseService.submitDraft(id);
        return ResponseEntity.ok(submitted);
    }

    // localhost:8080/api/expenses/suggest-categories
    @Operation(summary = "Get category suggestions based on history")
    @GetMapping("/suggest-categories")
    public ResponseEntity<?> suggestCategories(@RequestParam(required = false) String title,
            org.springframework.security.core.Authentication auth) {
        com.expensemanagement.Entities.User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(categorySuggestionService.suggestCategories(user, title));
    }

    // localhost:8080/api/expenses/{id}/split
    @Operation(summary = "Split an expense with other users")
    @PostMapping("/{id}/split")
    public ResponseEntity<?> splitExpense(@PathVariable Long id,
            @RequestBody List<com.expensemanagement.Services.ExpenseSplitService.UserAmount> splits) {
        Expense expense = expenseService.getById(id);
        if (expense == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(expenseSplitService.splitExpense(expense, splits));
    }

    // localhost:8080/expense/add
    @Operation()
    @PostMapping("/add")
    public ResponseEntity<?> addExpense(@RequestBody Expense expense) {

        Expense saveExpense = expenseService.saveExpense(expense);
        if (saveExpense != null) {
            return ResponseEntity.ok(saveExpense);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not saved");
        }
    }

    // localhost:8080/expense/get
    @Operation()
    @GetMapping("/get")
    public ResponseEntity<?> findAll() {
        List<Expense> expenses = expenseService.getallExpenses();
        if (expenses != null) {
            return ResponseEntity.ok(expenses);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No expenses found");
        }

    }

    // localhost:8080/expense/getbyid/1
    @Operation
    @GetMapping("/getbyid/{id}")
    public ResponseEntity<?> findById(@PathVariable long id) {
        Expense expense = expenseService.getById(id);
        if (expense != null) {
            return ResponseEntity.ok(expense);
        } else {
            return ResponseEntity.badRequest().body("No expense found");
        }
    }

    // localhost:8080/expense/update/1
    @Operation()
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable long id, @RequestBody Expense expense) {
        Expense updateExpense = expenseService.updateById(id, expense);
        if (updateExpense != null) {
            return ResponseEntity.ok(updateExpense);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not updated");
        }
    }

    // localhost:8080/expense/delete/1
    @Operation()
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable long id) {
        boolean deleteExpense = expenseService.deleteExpense(id);
        if (deleteExpense) {
            return ResponseEntity.ok("Expense deleted");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not deleted");
        }
    }

    // GET /api/expenses/search?query=...
    @Operation(summary = "Search expenses by keyword")
    @GetMapping("/search")
    public ResponseEntity<?> searchExpenses(@RequestParam String query,
            org.springframework.security.core.Authentication auth) {
        com.expensemanagement.Entities.User currentUser = userRepository.findByEmail(auth.getName()).orElseThrow();
        List<Expense> results = expenseService.searchExpenses(query, currentUser);
        return ResponseEntity.ok(results);
    }

}
