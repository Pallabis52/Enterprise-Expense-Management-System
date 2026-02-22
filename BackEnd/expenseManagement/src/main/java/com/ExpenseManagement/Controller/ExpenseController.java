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

    // localhost:8080/expense/getbymonthandyear/1/2021
    @Operation()
    @GetMapping("/getbymonthandyear/{month}/{year}")
    public ResponseEntity<?> getbymonthandyear(@PathVariable int month, @PathVariable int year) {
        List<Expense> getbymonthandyear = expenseService.getbymonthandyear(month, year);
        if (getbymonthandyear != null) {
            return ResponseEntity.ok(getbymonthandyear);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No expenses found");
        }
    }

    // localhost:8080/expense/approve/1/ROLE
    @Operation()
    @PutMapping("/approve/{id}/{role}")
    public ResponseEntity<?> approveExpense(@PathVariable long id, @PathVariable String role) {
        Expense approveExpense = approvalService.approveExpense(id, role);
        if (approveExpense != null) {
            return ResponseEntity.ok(approveExpense);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not approved");
        }
    }

    // localhost:8080/expense/category/FOOD
    @Operation()
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getbycategory(@PathVariable String category) {
        // Updated to pass String directly, allowing dynamic categories
        List<Expense> expensesByCategory = expenseService.getExpensesByCategory(category);
        if (expensesByCategory != null) {
            return ResponseEntity.ok(expensesByCategory);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No expenses found");
        }

    }

    // localhost:8080/expense/id/fileupload
    @Operation()
    @PostMapping("/{id}/fileupload")
    public ResponseEntity<?> uploadfile(@PathVariable long id, @RequestParam MultipartFile file) throws IOException {
        Expense element = expenseService.getById(id);
        if (element == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
        } else {
            String filepath = fileService.saveFile(file);
            element.setRecipturl(filepath);
            return ResponseEntity.ok(expenseService.saveExpense(element));
        }
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

}
