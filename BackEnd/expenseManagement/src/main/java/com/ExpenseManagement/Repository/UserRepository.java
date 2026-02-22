package com.expensemanagement.Repository;

import com.expensemanagement.Entities.Role;
import com.expensemanagement.Entities.Team;
import com.expensemanagement.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findByTeam(Team team);

    List<User> findByRole(Role role);
}
