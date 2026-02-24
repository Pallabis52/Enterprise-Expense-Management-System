package com.expensemanagement.Controller;

import com.expensemanagement.DTO.AIDTOs;
import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Repository.ExpenseRepository;
import com.expensemanagement.Services.ApprovalAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerAIController {

    private final ApprovalAIService approvalAIService;
    private final ExpenseRepository expenseRepository;

    @GetMapping("/approval-recommendation/{expenseId}")
    public CompletableFuture<ResponseEntity<AIDTOs.ApprovalRecommendation>> getRecommendation(
            @PathVariable Long expenseId) {
        return expenseRepository.findById(expenseId)
                .map(expense -> approvalAIService.getRecommendation(expense)
                        .thenApply(ResponseEntity::ok))
                .orElse(CompletableFuture.completedFuture(ResponseEntity.notFound().build()));
    }
}
