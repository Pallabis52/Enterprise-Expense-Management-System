package com.expensemanagement.controller;

import com.expensemanagement.dto.AuthResponse;
import com.expensemanagement.dto.LoginRequest;
import com.expensemanagement.dto.RegisterRequest;
import com.expensemanagement.services.AuthService;
import com.expensemanagement.services.InviteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication endpoints — publicly accessible (no JWT required).
 * POST /api/auth/login
 * POST /api/auth/register
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final InviteService inviteService;

    /** POST /api/auth/login */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /** POST /api/auth/register */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // If invite token present, accept it (mark ACCEPTED in DB)
        if (request.getToken() != null && !request.getToken().isBlank()) {
            try {
                inviteService.acceptInvite(request.getToken());
            } catch (Exception e) {
                log.warn("Invite acceptance skipped: {}", e.getMessage());
            }
        }
        return ResponseEntity.ok(authService.register(request));
    }
}
