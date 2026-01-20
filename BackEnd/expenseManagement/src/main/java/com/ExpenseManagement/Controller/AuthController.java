package com.ExpenseManagement.Controller;

import com.ExpenseManagement.DTO.AuthResponse;
import com.ExpenseManagement.DTO.LoginRequest;
import com.ExpenseManagement.DTO.RegisterRequest;
import com.ExpenseManagement.Entities.User;
import com.ExpenseManagement.Services.UserService;
import com.ExpenseManagement.Security.JwtUtils;
import com.ExpenseManagement.Security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private org.springframework.security.authentication.AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        final org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService
                .loadUserByUsername(request.getEmail());
        final String token = jwtUtils.generateToken(userDetails);

        // Fetch full user entity to get Name/Role for response (or extract from
        // UserDetails if embedded)
        // Since we need User entity for AuthResponse helper, let's fetch it via Service
        // or Repo
        User user = userService.getUserByEmail(request.getEmail());

        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole()));
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }
}
