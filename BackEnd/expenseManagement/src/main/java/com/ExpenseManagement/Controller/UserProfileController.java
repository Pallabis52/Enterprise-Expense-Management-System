package com.expensemanagement.controller;

import com.expensemanagement.entities.User;
import com.expensemanagement.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * User profile management — authenticated users of all roles.
 * GET /api/profile
 * PUT /api/profile
 */
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserService userService;

    /** GET /api/profile — returns the currently logged-in user's profile */
    @GetMapping
    public ResponseEntity<User> getProfile(Authentication auth) {
        return ResponseEntity.ok(userService.getUserByEmail(auth.getName()));
    }

    /** PUT /api/profile — update name, phone, or other non-sensitive fields */
    @PutMapping
    public ResponseEntity<User> updateProfile(
            @RequestBody Map<String, String> body, Authentication auth) {
        User user = userService.getUserByEmail(auth.getName());
        if (body.containsKey("name"))
            user.setName(body.get("name"));
        return ResponseEntity.ok(userService.updateUser(user));
    }
}
