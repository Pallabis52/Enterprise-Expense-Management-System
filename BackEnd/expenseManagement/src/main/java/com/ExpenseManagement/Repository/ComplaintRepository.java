package com.expensemanagement.repository;

import com.expensemanagement.entities.Complaint;
import com.expensemanagement.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing Complaint entities.
 */
@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByCreatedBy(User user);

    List<Complaint> findByRoleLevel(String roleLevel);

    List<Complaint> findTop10ByCreatedByOrderByCreatedAtDesc(User user);
}
