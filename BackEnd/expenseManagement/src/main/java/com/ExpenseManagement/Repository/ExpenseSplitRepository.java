package com.expensemanagement.repository;

import com.expensemanagement.entities.ExpenseSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {
    List<ExpenseSplit> findByExpenseId(Long expenseId);

    List<ExpenseSplit> findBySplitWithUserId(Long userId);

    List<ExpenseSplit> findByExpenseIdAndStatus(Long expenseId, String status);
}
