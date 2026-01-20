package com.ExpenseManagement.Repository;

import com.ExpenseManagement.Entities.ExpensePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExpensePolicyRepository extends JpaRepository<ExpensePolicy, Long> {
    List<ExpensePolicy> findByIsActiveTrue();
}
