package com.ExpenseManagement.Controller;

import com.ExpenseManagement.Entities.Approval_Status;
import com.ExpenseManagement.Entities.Expense;
import com.ExpenseManagement.Entities.User;
import com.ExpenseManagement.Services.ManagerService;
import com.ExpenseManagement.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    @Autowired
    private ManagerService managerService;

    @Autowired
    private UserService userService;

    private Long getCurrentManagerId() {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        String email;
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        return userService.getUserByEmail(email).getId();
    }

    @GetMapping("/expenses")
    public ResponseEntity<Page<Expense>> getTeamExpenses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String status) {

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("date").descending());
        Approval_Status approvalStatus = status != null && !status.equals("all")
                ? Approval_Status.valueOf(status)
                : null;

        return ResponseEntity.ok(managerService.getTeamExpenses(getCurrentManagerId(), approvalStatus, pageable));
    }

    @PutMapping("/expenses/{id}/approve")
    public ResponseEntity<Expense> approveExpense(@PathVariable Long id) {
        return ResponseEntity.ok(managerService.approveExpense(id, getCurrentManagerId()));
    }

    @PutMapping("/expenses/{id}/reject")
    public ResponseEntity<Expense> rejectExpense(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(managerService.rejectExpense(id, body.get("reason")));
    }

    @GetMapping("/team")
    public ResponseEntity<List<User>> getTeamMembers() {
        return ResponseEntity.ok(userService.getTeamMembers(getCurrentManagerId()));
    }

    @GetMapping("/reports/stats")
    public ResponseEntity<Map<String, Object>> getTeamStats() {
        Long managerId = getCurrentManagerId();
        Map<String, Object> stats = new HashMap<>();
        stats.put("approvedCount", managerService.getTeamApprovedTotal(managerId)); // Should be count, but reusing
                                                                                    // total for demo
        stats.put("totalSpent", managerService.getTeamApprovedTotal(managerId));
        stats.put("pendingCount", 0); // Need impl
        return ResponseEntity.ok(stats);
    }
}
