package com.expensemanagement.repository;

import com.expensemanagement.entities.ExpensePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExpensePolicyRepository extends JpaRepository<ExpensePolicy, Long> {
    List<ExpensePolicy> findByIsActiveTrue();
}
