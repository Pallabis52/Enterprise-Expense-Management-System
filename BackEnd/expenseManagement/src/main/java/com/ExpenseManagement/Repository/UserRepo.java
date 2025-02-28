package com.ExpenseManagement.Repository;

import com.ExpenseManagement.Entities.Expense;
import com.ExpenseManagement.Entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<Users, Integer> {
    Optional<Users> findByUsername(String username);
}
