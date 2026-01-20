package com.ExpenseManagement.Repository;

import com.ExpenseManagement.Entities.Role;
import com.ExpenseManagement.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByManagerId(Long managerId);
    List<User> findByRole(Role role);
}
