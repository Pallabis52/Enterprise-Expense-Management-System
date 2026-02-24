package com.expensemanagement.Security;

import com.expensemanagement.Entities.Role;
import com.expensemanagement.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

        private final UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                com.expensemanagement.Entities.User user = userRepository.findByEmail(username)
                                .orElseThrow(() -> new UsernameNotFoundException(
                                                "User not found with email: " + username));

                // Null-safe role handling: default to USER if no role is set in the DB
                Role role = user.getRole() != null ? user.getRole() : Role.USER;
                if (user.getRole() == null) {
                        log.warn("User {} has no role assigned in the database. Defaulting to USER.", username);
                }

                // Ensure authority starts with ROLE_ for hasRole() compatibility
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                                new SimpleGrantedAuthority("ROLE_" + role.name()));

                log.debug("Loading user {} with authorities: {}", username, authorities);

                return new org.springframework.security.core.userdetails.User(
                                user.getEmail(),
                                user.getPassword(),
                                authorities);
        }
}
