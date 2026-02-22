package com.expensemanagement.Repository;

import com.expensemanagement.Entities.Team;
import com.expensemanagement.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByManager(User manager);

    Optional<Team> findByName(String name);
}
