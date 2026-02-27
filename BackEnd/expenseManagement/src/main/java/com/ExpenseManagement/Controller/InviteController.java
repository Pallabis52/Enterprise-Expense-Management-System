package com.expensemanagement.controller;

import com.expensemanagement.dto.Invite.InviteRequest;
import com.expensemanagement.entities.InviteToken;
import com.expensemanagement.entities.User;
import com.expensemanagement.services.InviteService;
import com.expensemanagement.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Invite management — roles: MANAGER, ADMIN.
 * POST /api/invites/create
 * GET /api/invites/validate/{token}
 */
@RestController
@RequestMapping("/api/invites")
@RequiredArgsConstructor
public class InviteController {

    private final InviteService inviteService;
    private final UserService userService;

    /** POST /api/invites/create */
    @PostMapping("/create")
    public ResponseEntity<InviteToken> create(
            @RequestBody InviteRequest request,
            Authentication auth) {
        User requester = userService.getUserByEmail(auth.getName());
        InviteToken token = inviteService.createInvite(
                request, requester.getId(), requester.getRole());
        return ResponseEntity.ok(token);
    }

    /** GET /api/invites/validate/{token} */
    @GetMapping("/validate/{token}")
    public ResponseEntity<InviteToken> validate(@PathVariable String token) {
        return ResponseEntity.ok(inviteService.validateToken(token));
    }
}
