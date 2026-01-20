package com.ExpenseManagement.Repository;

import com.ExpenseManagement.Entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);

    @Query("SELECT c FROM Category c WHERE c.allowedRole = :allowedRole OR c.allowedRole IS NULL")
    java.util.List<Category> findByAllowedRoleOrNull(
            @Param("allowedRole") com.ExpenseManagement.Entities.Role allowedRole);
}
