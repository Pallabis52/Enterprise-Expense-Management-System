package com.ExpenseManagement.Services;

import com.ExpenseManagement.DTO.LoginRequest;
import com.ExpenseManagement.DTO.RegisterRequest;
import com.ExpenseManagement.Entities.Role;
import com.ExpenseManagement.Entities.User;
import com.ExpenseManagement.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

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

    public List<User> getTeamMembers(Long managerId) {
        return userRepository.findByManagerId(managerId);
    }

    public User assignManager(Long userId, Long managerId) {
        User user = getUserById(userId);
        User manager = getUserById(managerId);
        if (manager.getRole() != Role.MANAGER && manager.getRole() != Role.ADMIN) {
            throw new RuntimeException("Assignee must be a Manager or Admin");
        }
        user.setManager(manager);
        return userRepository.save(user);
    }

    public User updateUser(User user) {
        return userRepository.save(user); // Basic save for now
    }
}
