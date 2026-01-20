package com.ExpenseManagement.Controller;

import com.ExpenseManagement.DTO.Invite.InviteRequest;
import com.ExpenseManagement.Entities.InviteToken;
import com.ExpenseManagement.Entities.Role;
import com.ExpenseManagement.Entities.User;
import com.ExpenseManagement.Services.InviteService;
import com.ExpenseManagement.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invites")
@RequiredArgsConstructor
public class InviteController {

    private final InviteService inviteService;
    private final UserService userService;

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        return userService.getUserByEmail(email);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<InviteToken> createInvite(@RequestBody InviteRequest request) {
        User requester = getAuthenticatedUser();
        return ResponseEntity.ok(inviteService.createInvite(request, requester.getId(), requester.getRole()));
    }

    @GetMapping("/validate/{token}")
    public ResponseEntity<InviteToken> validateToken(@PathVariable String token) {
        return ResponseEntity.ok(inviteService.validateToken(token));
    }
}
