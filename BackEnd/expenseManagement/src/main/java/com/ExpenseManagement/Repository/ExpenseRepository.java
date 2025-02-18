package com.ExpenseManagement.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ExpenseManagement.Entities.Expense;
import com.ExpenseManagement.Entities.Expense_Category;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByCategory(Expense_Category category);

    @Query("SELECT e FROM Expense e WHERE MONTH(e.date) = :month AND YEAR(e.date) = :year")
    List<Expense> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e GROUP BY e.category")
    Expense getbreakdown(@Param("category") Expense_Category category);

}
