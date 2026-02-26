package com.expensemanagement.repository;

import com.expensemanagement.entities.Team;
import com.expensemanagement.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByManager(User manager);

    Optional<Team> findByName(String name);
}
