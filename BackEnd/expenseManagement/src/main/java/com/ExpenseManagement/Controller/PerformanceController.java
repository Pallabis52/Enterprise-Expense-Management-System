package com.expensemanagement.controller;

import com.expensemanagement.dto.Performance.TeamPerformanceDTO;
import com.expensemanagement.entities.User;
import com.expensemanagement.services.PerformanceService;
import com.expensemanagement.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Team performance metrics for managers.
 * GET /api/performance/team
 */
@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
public class PerformanceController {

    private final PerformanceService performanceService;
    private final UserService userService;

    /** GET /api/performance/team */
    @GetMapping("/team")
    public ResponseEntity<TeamPerformanceDTO> getTeamPerformance(Authentication auth) {
        User manager = userService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(performanceService.getTeamPerformance(manager.getId()));
    }
}
