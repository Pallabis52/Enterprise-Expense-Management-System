package com.expensemanagement.repository;

import com.expensemanagement.entities.VendorStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorStatRepository extends JpaRepository<VendorStat, Long> {
    Optional<VendorStat> findByVendorNameIgnoreCase(String vendorName);

    List<VendorStat> findBySuspiciousTrue();

    List<VendorStat> findAllByOrderByTotalAmountDesc();
}
