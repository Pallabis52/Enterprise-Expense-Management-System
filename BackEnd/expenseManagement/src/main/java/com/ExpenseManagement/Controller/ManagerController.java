package com.expensemanagement.Controller;

import java.util.List;
import java.util.Map;

import com.expensemanagement.AI.AIResponse;
import com.expensemanagement.AI.AIService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
public class ManagerController {

    private final UserRepository userRepository;
    private final ManagerService managerService;
    private final PerformanceService performanceService;
    private final AIService aiService;

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

    // ══════════════════════════════════════════════════════════════════════
    // AI FEATURES (Manager Role)
    // ══════════════════════════════════════════════════════════════════════

    /**
     * Feature 5: AI Approval Recommendation
     * GET /api/manager/ai/recommend/{expenseId}
     */
    @GetMapping("/ai/recommend/{expenseId}")
    public ResponseEntity<AIResponse> approvalRecommendation(
            @PathVariable Long expenseId, Authentication auth) {
        User manager = userRepository.findByEmail(auth.getName()).orElseThrow();
        Expense expense = managerService.getExpenseById(expenseId, manager);
        if (expense == null)
            return ResponseEntity.notFound().build();
        User owner = expense.getUser();
        return ResponseEntity.ok(aiService.approvalRecommendation(expense, owner).join());
    }

    /**
     * Feature 6: Risk Scoring
     * GET /api/manager/ai/risk/{expenseId}
     */
    @GetMapping("/ai/risk/{expenseId}")
    public ResponseEntity<AIResponse> riskScore(
            @PathVariable Long expenseId, Authentication auth) {
        User manager = userRepository.findByEmail(auth.getName()).orElseThrow();
        Expense expense = managerService.getExpenseById(expenseId, manager);
        if (expense == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(aiService.riskScore(expense, expense.getUser()).join());
    }

    /**
     * Feature 7: Team Spending Summary
     * GET /api/manager/ai/team-summary
     */
    @GetMapping("/ai/team-summary")
    public ResponseEntity<AIResponse> teamSummary(Authentication auth) {
        User manager = userRepository.findByEmail(auth.getName()).orElseThrow();
        com.expensemanagement.Entities.Team team = manager.getTeam();
        if (team == null)
            return ResponseEntity.badRequest().build();
        List<User> members = team.getMembers();
        java.time.LocalDate now = java.time.LocalDate.now();
        Double monthlySpend = managerService.getTeamMonthlySpend(members, now.getMonthValue(), now.getYear());
        Double budget = managerService.getTeamBudget(team.getId(), now.getMonthValue(), now.getYear());
        return ResponseEntity.ok(aiService.teamSummary(
                members,
                monthlySpend != null ? monthlySpend : 0,
                budget != null ? budget : 0,
                team.getName()).join());
    }

    /**
     * Feature 10: AI Chatbot
     * POST /api/manager/ai/chat
     * Body: { "message": "...", "context": "..." }
     */
    @PostMapping("/ai/chat")
    public ResponseEntity<AIResponse> chat(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        User manager = userRepository.findByEmail(auth.getName()).orElseThrow();
        String message = (String) body.getOrDefault("message", "");
        String context = (String) body.getOrDefault("context", "");
        return ResponseEntity.ok(aiService.chat("MANAGER", manager.getName(), message, context).join());
    }
}
