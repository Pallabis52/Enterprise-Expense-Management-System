package com.expensemanagement.Services;

import com.expensemanagement.Entities.FreezePeriod;
import com.expensemanagement.Repository.FreezePeriodRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Manages expense freeze periods (Feature 4).
 * Admin can lock a (month, year) to prevent new user expense submissions.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FreezePeriodService {

    private final FreezePeriodRepository freezePeriodRepository;

    /**
     * Returns true if the current calendar month is locked.
     */
    public boolean isCurrentMonthFrozen() {
        LocalDate now = LocalDate.now();
        return freezePeriodRepository.existsByMonthAndYearAndLockedTrue(now.getMonthValue(), now.getYear());
    }

    /**
     * Returns true if a specific (month, year) is locked.
     */
    public boolean isFrozen(int month, int year) {
        return freezePeriodRepository.existsByMonthAndYearAndLockedTrue(month, year);
    }

    /**
     * Locks the current month (Admin only).
     */
    @Transactional
    public FreezePeriod lockCurrentMonth() {
        LocalDate now = LocalDate.now();
        return lockMonth(now.getMonthValue(), now.getYear());
    }

    /**
     * Locks a specific (month, year) (Admin only).
     */
    @Transactional
    public FreezePeriod lockMonth(int month, int year) {
        FreezePeriod fp = freezePeriodRepository.findByMonthAndYear(month, year)
                .orElse(FreezePeriod.builder().month(month).year(year).build());
        fp.setLocked(true);
        FreezePeriod saved = freezePeriodRepository.save(fp);
        log.info("Expense submission LOCKED for {}/{}", month, year);
        return saved;
    }

    /**
     * Unlocks a specific (month, year) (Admin only).
     */
    @Transactional
    public void unlockMonth(int month, int year) {
        freezePeriodRepository.findByMonthAndYear(month, year).ifPresent(fp -> {
            fp.setLocked(false);
            freezePeriodRepository.save(fp);
            log.info("Expense submission UNLOCKED for {}/{}", month, year);
        });
    }

    /**
     * Returns all freeze period records.
     */
    public List<FreezePeriod> getAllFreezePeriods() {
        return freezePeriodRepository.findAll();
    }
}
