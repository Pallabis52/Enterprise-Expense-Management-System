package com.expensemanagement.services;

import com.expensemanagement.dto.RegisterRequest;
import com.expensemanagement.entities.Expense;
import com.expensemanagement.entities.InviteToken;
import com.expensemanagement.entities.Role;
import com.expensemanagement.entities.Team;
import com.expensemanagement.entities.User;
import com.expensemanagement.repository.ExpenseRepository;
import com.expensemanagement.repository.ExpenseSplitRepository;
import com.expensemanagement.repository.InviteTokenRepository;
import com.expensemanagement.repository.TeamRepository;
import com.expensemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final TeamRepository teamRepository;
    private final InviteTokenRepository inviteTokenRepository;

    public User register(RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER);
        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(User user) {
        return userRepository.save(user); // Basic save for now
    }

    @Transactional
    public void terminateUser(User user) {
        // 1. Delete splits involving this user
        expenseSplitRepository.deleteBySplitWithUserId(user.getId());

        // 2. Delete expenses owned by this user (and their splits)
        List<Expense> userExpenses = expenseRepository.findByUser(user);
        if (!userExpenses.isEmpty()) {
            expenseSplitRepository.deleteByExpenseIn(userExpenses);
            expenseRepository.deleteByUser(user);
        }

        // 3. Handle Team Management
        Optional<Team> managedTeam = teamRepository.findByManager(user);
        if (managedTeam.isPresent()) {
            Team team = managedTeam.get();
            team.setManager(null);
            teamRepository.save(team);
        }

        // 4. Handle Invite Tokens
        inviteTokenRepository.deleteByManagerId(user.getId());

        // 5. Soft Delete (Deactivate) the User record
        user.setTerminated(true);
        userRepository.save(user);
    }
}
