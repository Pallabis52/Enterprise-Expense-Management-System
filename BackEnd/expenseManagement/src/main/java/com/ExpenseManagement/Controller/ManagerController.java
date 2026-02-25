package com.expensemanagement.Controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.expensemanagement.Entities.Approval_Status;
import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.Team;
import com.expensemanagement.Entities.User;
import com.expensemanagement.Repository.UserRepository;
import com.expensemanagement.Services.ManagerService;
import com.expensemanagement.Services.PerformanceService;
import com.expensemanagement.DTO.Performance.TeamPerformanceDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')")
public class ManagerController {

    private final UserRepository userRepository;
    private final ManagerService managerService;
    private final PerformanceService performanceService;

    // ── team info ─────────────────────────────────────────────────────────────

    @GetMapping("/team")
    public ResponseEntity<Team> getTeam(Authentication authentication) {
        User manager = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(managerService.getTeam(manager.getId()));
    }

    @GetMapping("/team/members")
    public ResponseEntity<List<User>> getTeamMembers(Authentication authentication) {
        User manager = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(managerService.getTeamMembers(manager.getId()));
    }

    // ── expense list ──────────────────────────────────────────────────────────

    @GetMapping("/team/expenses")
    public ResponseEntity<Page<Expense>> getTeamExpenses(
            Authentication authentication,
            @RequestParam(required = false) Approval_Status status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {

        User manager = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(managerService.getTeamExpenses(manager.getId(), status, pageable));
    }

    // ── approval actions ──────────────────────────────────────────────────────

    @PutMapping("/expenses/{id}/approve")
    public ResponseEntity<Expense> approveExpense(
            Authentication authentication,
            @PathVariable Long id) {
        User manager = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(managerService.approveExpense(id, manager.getId()));
    }

    @PutMapping("/expenses/{id}/reject")
    public ResponseEntity<Expense> rejectExpense(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = (body != null) ? body.getOrDefault("reason", "No reason provided") : "No reason provided";
        return ResponseEntity.ok(managerService.rejectExpense(id, reason));
    }

    /**
     * Feature 1 & 8: Forward mid/high-tier expense to Admin with an optional
     * comment.
     * Valid for amounts > ₹10,000.
     */
    @PutMapping("/expenses/{id}/forward")
    public ResponseEntity<Expense> forwardToAdmin(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        User manager = userRepository.findByEmail(authentication.getName()).orElseThrow();
        String comment = (body != null) ? body.getOrDefault("comment", "Forwarded for admin review")
                : "Forwarded for admin review";
        return ResponseEntity.ok(managerService.forwardToAdmin(id, manager.getId(), comment));
    }

    // ── performance ───────────────────────────────────────────────────────────

    @GetMapping("/team/performance")
    public ResponseEntity<TeamPerformanceDTO> getTeamPerformance(Authentication authentication) {
        User manager = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(performanceService.getTeamPerformance(manager.getId()));
    }

    // ── dashboard (Feature 7) ─────────────────────────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getManagerDashboard(Authentication authentication) {
        User manager = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(managerService.getManagerDashboard(manager.getId()));
    }

}
