package com.expensemanagement.services;

import com.expensemanagement.entities.Vendor;
import com.expensemanagement.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    @Transactional
    public void trackVendor(String vendorName, double amount, com.expensemanagement.entities.User user) {
        if (vendorName == null || vendorName.isBlank() || user == null)
            return;

        Vendor vendor = vendorRepository.findByNameIgnoreCaseAndUserId(vendorName, user.getId())
                .orElse(Vendor.builder()
                        .name(vendorName)
                        .user(user)
                        .transactionCount(0L)
                        .totalSpend(0.0)
                        .avgAmount(0.0)
                        .build());

        // Update stats
        vendor.setTransactionCount(vendor.getTransactionCount() + 1);
        vendor.setTotalSpend(vendor.getTotalSpend() + amount);
        vendor.setAvgAmount(vendor.getTotalSpend() / vendor.getTransactionCount());

        // Anomaly Detection Logic
        if (vendor.getTransactionCount() > 3 && amount > (vendor.getAvgAmount() * 3)) {
            vendor.setAnomalyCount(vendor.getAnomalyCount() + 1);
            // Trust Score Logic: trustScore = 100 - anomalyCount * 10
            vendor.setTrustScore(Math.max(0, 100 - vendor.getAnomalyCount() * 10));
            log.warn("Anomaly detected for vendor {} and user {}. Amount: {}, Avg: {}",
                    vendorName, user.getName(), amount, vendor.getAvgAmount());
        }

        vendorRepository.save(vendor);
    }

    public List<String> getVendorSuggestions(String query) {
        return vendorRepository.findDistinctNamesByQuery(query);
    }

    public Map<String, Object> getVendorInsights(String vendorName, Long userId) {
        return vendorRepository.findByNameIgnoreCaseAndUserId(vendorName, userId)
                .map(v -> {
                    Map<String, Object> insights = new HashMap<>();
                    insights.put("avgAmount", v.getAvgAmount());
                    insights.put("totalSpend", v.getTotalSpend());
                    insights.put("transactionCount", v.getTransactionCount());
                    insights.put("category", v.getCategory());
                    insights.put("trustScore", v.getTrustScore());

                    // Simple prediction logic
                    double min = Math.max(0, v.getAvgAmount() * 0.8);
                    double max = v.getAvgAmount() * 1.5;
                    insights.put("suggestedRange", String.format("₹%.0f – ₹%.0f", min, max));

                    return insights;
                })
                .orElse(new HashMap<>());
    }

    public boolean isAmountSuspicious(String vendorName, double amount, Long userId) {
        return vendorRepository.findByNameIgnoreCaseAndUserId(vendorName, userId)
                .map(v -> v.getTransactionCount() > 3 && amount > (v.getAvgAmount() * 3))
                .orElse(false);
    }

    public List<String> getFrequentVendors(Long userId) {
        return vendorRepository.findTop5ByUserIdOrderByTransactionCountDesc(userId)
                .stream()
                .map(Vendor::getName)
                .collect(Collectors.toList());
    }
}
