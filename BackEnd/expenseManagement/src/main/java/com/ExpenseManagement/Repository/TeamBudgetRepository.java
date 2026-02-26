package com.expensemanagement.repository;

import com.expensemanagement.entities.Team;
import com.expensemanagement.entities.TeamBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface TeamBudgetRepository extends JpaRepository<TeamBudget, Long> {

    Optional<TeamBudget> findByTeamAndMonthAndYear(Team team, int month, int year);

    List<TeamBudget> findByMonthAndYear(int month, int year);
}
