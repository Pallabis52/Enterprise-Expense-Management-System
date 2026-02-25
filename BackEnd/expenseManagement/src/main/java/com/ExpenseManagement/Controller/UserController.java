package com.expensemanagement.Controller;

import com.expensemanagement.DTO.UserStatsDTO;
import com.expensemanagement.Entities.Approval_Status;
import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.User;
import com.expensemanagement.Repository.ExpenseRepository;
import com.expensemanagement.Repository.UserRepository;
import com.expensemanagement.Services.ExpenseService;
import com.expensemanagement.Services.FreezePeriodService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserController {

        private final ExpenseService expenseService;
        private final UserRepository userRepository;
        private final ExpenseRepository expenseRepository;
        private final FreezePeriodService freezePeriodService;

        // ── stats ─────────────────────────────────────────────────────────────────

        @GetMapping("/expenses/stats")
        public ResponseEntity<UserStatsDTO> getUserStats(Authentication authentication) {
                String email = authentication.getName();
                log.info("Fetching stats for user: {}", email);
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Double totalSpent = expenseService.getUserTotalSpent(user);
                Long pending = expenseService.getUserCountByStatus(user, Approval_Status.PENDING);
                Long approved = expenseService.getUserCountByStatus(user, Approval_Status.APPROVED);
                Long rejected = expenseService.getUserCountByStatus(user, Approval_Status.REJECTED);

                return ResponseEntity.ok(UserStatsDTO.builder()
                                .totalSpent(totalSpent)
                                .pendingCount(pending)
                                .approvedCount(approved)
                                .rejectedCount(rejected)
                                .build());
        }

        // ── Feature 7: User dashboard with freeze status ───────────────────────────

        @GetMapping("/dashboard")
        public ResponseEntity<Map<String, Object>> getUserDashboard(Authentication authentication) {
                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Double totalSpent = expenseService.getUserTotalSpent(user);
                Long pending = expenseService.getUserCountByStatus(user, Approval_Status.PENDING);
                Long approved = expenseService.getUserCountByStatus(user, Approval_Status.APPROVED);
                Long rejected = expenseService.getUserCountByStatus(user, Approval_Status.REJECTED);
                Long forwarded = expenseService.getUserCountByStatus(user, Approval_Status.FORWARDED_TO_ADMIN);

                // Rejected expenses with reasons (last 10)
                List<Expense> rejectedExpenses = expenseRepository.findByUser(user).stream()
                                .filter(e -> e.getStatus() == Approval_Status.REJECTED)
                                .limit(10)
                                .toList();

                boolean frozen = freezePeriodService.isCurrentMonthFrozen();

                Map<String, Object> dashboard = new HashMap<>();
                dashboard.put("totalSpent", totalSpent);
                dashboard.put("pendingCount", pending);
                dashboard.put("approvedCount", approved);
                dashboard.put("rejectedCount", rejected);
                dashboard.put("forwardedCount", forwarded);
                dashboard.put("recentRejections", rejectedExpenses);
                dashboard.put("isFreezePeriod", frozen);
                dashboard.put("freezeMessage", frozen
                                ? "Expense submission is currently locked for this period. Contact your administrator."
                                : null);
                return ResponseEntity.ok(dashboard);
        }

        // ── expense CRUD ──────────────────────────────────────────────────────────

        @GetMapping("/expenses")
        public ResponseEntity<Page<Expense>> getUserExpenses(
                        Authentication authentication,
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "10") int limit) {

                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Pageable pageable = PageRequest.of(page - 1, limit);
                return ResponseEntity.ok(expenseService.getUserExpenses(user, pageable));
        }

        @PostMapping("/expenses")
        public ResponseEntity<Expense> createExpense(
                        Authentication authentication,
                        @RequestBody Expense expense) {

                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                expense.setUser(user);
                if (expense.getStatus() == null) {
                        expense.setStatus(Approval_Status.PENDING);
                }
                return ResponseEntity.ok(expenseService.saveExpense(expense));
        }

        @GetMapping("/expenses/{id}")
        public ResponseEntity<Expense> getExpenseById(
                        Authentication authentication,
                        @PathVariable Long id) {
                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Expense expense = expenseService.getExpenseByIdAndUser(id, user);
                return expense != null ? ResponseEntity.ok(expense) : ResponseEntity.notFound().build();
        }

        @PutMapping("/expenses/{id}")
        public ResponseEntity<Expense> updateExpense(
                        Authentication authentication,
                        @PathVariable Long id,
                        @RequestBody Expense expenseDetails) {
                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Expense existing = expenseService.getExpenseByIdAndUser(id, user);
                if (existing == null) {
                        return ResponseEntity.notFound().build();
                }
                return ResponseEntity.ok(expenseService.updateById(id, expenseDetails));
        }

        @DeleteMapping("/expenses/{id}")
        public ResponseEntity<Void> deleteExpense(
                        Authentication authentication,
                        @PathVariable Long id) {
                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Expense existing = expenseService.getExpenseByIdAndUser(id, user);
                if (existing == null) {
                        return ResponseEntity.notFound().build();
                }
                expenseService.deleteExpense(id);
                return ResponseEntity.ok().build();
        }

}
