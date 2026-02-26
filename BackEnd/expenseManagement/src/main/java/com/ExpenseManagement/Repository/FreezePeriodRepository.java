package com.expensemanagement.repository;

import com.expensemanagement.entities.FreezePeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FreezePeriodRepository extends JpaRepository<FreezePeriod, Long> {

    Optional<FreezePeriod> findByMonthAndYear(int month, int year);

    boolean existsByMonthAndYearAndLockedTrue(int month, int year);
}
