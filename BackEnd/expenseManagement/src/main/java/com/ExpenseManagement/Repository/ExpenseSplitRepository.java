package com.expensemanagement.Repository;

import com.expensemanagement.Entities.ExpenseSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {
    List<ExpenseSplit> findByExpenseId(Long expenseId);
    List<ExpenseSplit> findBySplitWithUserId(Long userId);
    List<ExpenseSplit> findByExpenseIdAndStatus(Long expenseId, String status);
}
