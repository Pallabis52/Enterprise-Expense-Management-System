package com.expensemanagement.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("No Bearer token found in Authorization header for: {}", request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            userEmail = jwtUtils.extractUsername(jwt);
            log.debug("JWT Token found for user: {} on path: {}", userEmail, request.getRequestURI());

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                if (jwtUtils.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("User {} authenticated successfully on path: {}", userEmail, request.getRequestURI());
                } else {
                    log.error("JWT token validation failed for user: {}", userEmail);
                    request.setAttribute("authError", "Token validation failed (expired or invalid). Please re-login.");
                }
            } else if (userEmail == null) {
                log.error("JWT token present but userEmail extracted is null");
                request.setAttribute("authError", "Invalid token: Identity could not be determined.");
            }
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            log.error("JWT token has expired: {}", e.getMessage());
            request.setAttribute("authError", "Session expired (JWT timeout). Please re-login.");
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            log.error("Malformed JWT token: {}", e.getMessage());
            request.setAttribute("authError", "Invalid token format. Possible transmission corruption.");
        } catch (io.jsonwebtoken.security.SecurityException e) {
            log.error("JWT signature validation failed: {}. Secret key mismatch.", e.getMessage());
            request.setAttribute("authError",
                    "Security key mismatch (System update occurred). Please log out and back in.");
        } catch (io.jsonwebtoken.JwtException e) {
            log.error("JWT processing failed: {}", e.getMessage());
            request.setAttribute("authError", "Authentication failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected authentication error: {} — {}", e.getClass().getSimpleName(), e.getMessage());
            request.setAttribute("authError", "Internal authentication error. Please try again.");
        }

        filterChain.doFilter(request, response);
    }
}
