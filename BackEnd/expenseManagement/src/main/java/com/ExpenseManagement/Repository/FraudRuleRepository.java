package com.expensemanagement.Repository;

import com.expensemanagement.Entities.FraudRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FraudRuleRepository extends JpaRepository<FraudRule, Long> {
    List<FraudRule> findByActiveTrue();

    List<FraudRule> findByRuleName(String ruleName);
}
