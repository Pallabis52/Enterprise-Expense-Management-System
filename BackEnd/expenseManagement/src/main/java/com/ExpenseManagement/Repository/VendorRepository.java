package com.expensemanagement.repository;

import com.expensemanagement.entities.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByNameIgnoreCaseAndUserId(String name, Long userId);

    @Query("SELECT v.name FROM Vendor v WHERE LOWER(v.name) LIKE LOWER(CONCAT('%', :query, '%')) GROUP BY v.name")
    List<String> findDistinctNamesByQuery(@Param("query") String query);

    List<Vendor> findTop5ByUserIdOrderByTransactionCountDesc(Long userId);

    List<Vendor> findByUserId(Long userId);
}
