package com.expensemanagement.Controller;

import com.expensemanagement.entities.User;
import com.expensemanagement.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/profile")
@RequiredArgsConstructor
public class UserProfileController {

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

    @GetMapping
    public ResponseEntity<User> getProfile() {
        return ResponseEntity.ok(getAuthenticatedUser());
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(@RequestBody User userUpdates) {
        User currentUser = getAuthenticatedUser();

        // Only allow updating non-sensitive fields
        currentUser.setName(userUpdates.getName());
        // Handle password change separately or here with hashing

        return ResponseEntity.ok(userService.updateUser(currentUser));
    }
}
