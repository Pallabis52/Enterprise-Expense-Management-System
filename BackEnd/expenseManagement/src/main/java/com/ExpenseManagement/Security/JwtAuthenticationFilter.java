package com.expensemanagement.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import java.io.IOException;
import java.util.List;
import java.util.function.Function;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtils jwtUtils;
    private final org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("AUTH-FLOW: Received " + request.getMethod() + " " + request.getRequestURI());

        // LOG ALL HEADERS TO DETECT STRIPPING
        java.util.Enumeration<String> headerNames = request.getHeaderNames();
        StringBuilder allHeaders = new StringBuilder();
        while (headerNames.hasMoreElements()) {
            String name = headerNames.nextElement();
            allHeaders.append(name).append("=").append(request.getHeader(name)).append(" | ");
        }
        log.info("AUTH-HEADERS-RECEIVED: {}", allHeaders.toString());

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null) {
            authHeader = request.getHeader("authorization");
        }

        System.out.println("AUTH-FLOW: Authorization header: " + (authHeader != null ? "PRESENT" : "MISSING"));

        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("AUTH-DIAGNOSTIC: No valid Bearer token found for URI: {}. Method: {}. Headers logged above.",
                    request.getRequestURI(), request.getMethod());
            request.setAttribute("authError", "Missing or invalid Authorization header format.");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        log.info("AUTH-DIAGNOSTIC: Processing Bearer token for URI: {}. Token starts with: {}",
                request.getRequestURI(), jwt.substring(0, Math.min(jwt.length(), 10)));

        try {
            Claims claims = jwtUtils.extractClaim(jwt, Function.identity());
            userEmail = claims.getSubject();
            log.info("AUTH-DIAGNOSTIC: Extracted user: {} from token.", userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Extract roles from claims as requested
                List<org.springframework.security.core.GrantedAuthority> authorities = new java.util.ArrayList<>();

                Object rolesObj = claims.get("roles");
                if (rolesObj instanceof List<?> rolesList) {
                    for (Object r : rolesList) {
                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "ROLE_" + r.toString()));
                    }
                } else {
                    String role = claims.get("role", String.class);
                    if (role != null) {
                        authorities.add(
                                new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role));
                    }
                }

                log.info("AUTH-DIAGNOSTIC: Roles extracted from JWT: {}", authorities);

                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                if (jwtUtils.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            authorities.isEmpty() ? userDetails.getAuthorities() : authorities);

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.info("AUTH-DIAGNOSTIC: Successfully authenticated user: {} for {}", userEmail,
                            request.getRequestURI());
                } else {
                    log.error(
                            "AUTH-DIAGNOSTIC: Token valid check FAILED for user: {} against URI: {}. Possible token-identity mismatch or cross-region session issue.",
                            userEmail,
                            request.getRequestURI());
                    request.setAttribute("authError",
                            "Token validation failed (Identity mismatch). Please log out and back in.");
                }
            } else if (userEmail == null) {
                log.error(
                        "AUTH-DIAGNOSTIC: JWT token present but userEmail (Subject) is null for URI: {}. Token may be corrupted or signed by different authority.",
                        request.getRequestURI());
                request.setAttribute("authError", "Invalid token payload: Identity missing.");
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
