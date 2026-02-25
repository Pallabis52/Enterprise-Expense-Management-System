package com.expensemanagement.Services;

import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.VendorStat;
import com.expensemanagement.Repository.VendorStatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VendorAnalyticsService {

    private final VendorStatRepository vendorStatRepository;

    @Transactional
    public void updateVendorStats(Expense expense) {
        if (expense.getVendorName() == null || expense.getVendorName().isBlank())
            return;

        try {
            VendorStat stat = vendorStatRepository.findByVendorNameIgnoreCase(expense.getVendorName())
                    .orElse(VendorStat.builder()
                            .vendorName(expense.getVendorName())
                            .transactionCount(0L)
                            .totalAmount(0.0)
                            .avgAmount(0.0)
                            .suspicious(false)
                            .build());

            stat.setTransactionCount(stat.getTransactionCount() + 1);
            stat.setTotalAmount(stat.getTotalAmount() + expense.getAmount());
            stat.setAvgAmount(stat.getTotalAmount() / stat.getTransactionCount());
            stat.setLastSeen(LocalDate.now());

            // Simple heuristic: if avg amount suddenly jumps or high count from single user
            // (future)
            if (expense.getAmount() > stat.getAvgAmount() * 3 && stat.getTransactionCount() > 5) {
                stat.setSuspicious(true);
            }

            vendorStatRepository.save(stat);
        } catch (Exception e) {
            log.error("Failed to update vendor stats (non-blocking): {}", e.getMessage());
        }
    }

    public List<VendorStat> getTopVendors() {
        return vendorStatRepository.findAllByOrderByTotalAmountDesc();
    }

    public List<VendorStat> getSuspiciousVendors() {
        return vendorStatRepository.findBySuspiciousTrue();
    }
}
