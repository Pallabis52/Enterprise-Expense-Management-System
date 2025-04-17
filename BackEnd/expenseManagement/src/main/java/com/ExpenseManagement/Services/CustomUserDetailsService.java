package com.ExpenseManagement.Services;

import com.ExpenseManagement.Entities.Expense;
import com.ExpenseManagement.Entities.Users;
import com.ExpenseManagement.Repository.ExpenseRepository;
import com.ExpenseManagement.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    public final UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Users> user = userRepo.findByUsername(username);
        if(user.isEmpty()){
            throw new UsernameNotFoundException("User not found");
        }
        Users users = user.get();
        return User.builder()
                .username(users.getUsername())
                .password(users.getPassword())
                .authorities(Collections.emptyList())
                .build();

    }
}
