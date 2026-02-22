package com.expensemanagement.Repository;

import com.expensemanagement.Entities.Approval_Status;
import com.expensemanagement.Entities.Expense;
import com.expensemanagement.Entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Find by User
    Page<Expense> findByUser(User user, Pageable pageable);

    List<Expense> findByUser(User user);

    java.util.Optional<Expense> findByIdAndUser(Long id, User user);

    // Find by Team (Users managed by Manager)
    // Assuming we pass the list of team member users
    Page<Expense> findByUserIn(List<User> users, Pageable pageable);

    // Find by Team and Status (Common filter)
    Page<Expense> findByUserInAndStatus(List<User> users, Approval_Status status, Pageable pageable);

    // Stats queries
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user IN :users AND e.status = 'APPROVED'")
    Double sumApprovedAmountByUserIn(@Param("users") List<User> users);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user IN :users AND e.status = 'PENDING'")
    Double sumPendingAmountByUserIn(@Param("users") List<User> users);

    // Admin: All expenses
    Page<Expense> findByStatus(Approval_Status status, Pageable pageable);

    // Missing methods for Service Impl
    @Query("SELECT e FROM Expense e WHERE MONTH(e.date) = :month AND YEAR(e.date) = :year")
    List<Expense> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    // Stats: Single User
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user")
    Double sumTotalAmountByUser(@Param("user") User user);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user AND e.status = :status")
    Double sumAmountByUserAndStatus(@Param("user") User user, @Param("status") Approval_Status status);

    @Query("SELECT COUNT(e) FROM Expense e WHERE e.user = :user AND e.status = :status")
    Long countByUserAndStatus(@Param("user") User user, @Param("status") Approval_Status status);

    List<Expense> findByCategory(String category);

    // --- Performance Analytics Queries ---

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user IN :users")
    Double sumTotalAmountByUserIn(@Param("users") List<User> users);

    @Query("SELECT COUNT(e) FROM Expense e WHERE e.user IN :users AND e.status = :status")
    Long countByUserInAndStatus(@Param("users") List<User> users, @Param("status") Approval_Status status);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.user IN :users GROUP BY e.category")
    List<Object[]> sumAmountByCategoryByUserIn(@Param("users") List<User> users);

    // Native query might be easier for month grouping or JPQL with function
    @Query("SELECT FUNCTION('TO_CHAR', e.date, 'YYYY-MM'), SUM(e.amount) FROM Expense e WHERE e.user IN :users GROUP BY FUNCTION('TO_CHAR', e.date, 'YYYY-MM')")
    List<Object[]> sumAmountByMonthByUserIn(@Param("users") List<User> users);

    @Query("SELECT e.user, SUM(e.amount) as total FROM Expense e WHERE e.user IN :users GROUP BY e.user ORDER BY total DESC")
    List<Object[]> findTopSpenders(@Param("users") List<User> users);

    // --- Admin Global Stats ---

    @Query("SELECT SUM(e.amount) FROM Expense e")
    Double sumTotalAmount();

    Long countByStatus(Approval_Status status);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e GROUP BY e.category")
    List<Object[]> sumAmountByCategory();

    @Query("SELECT MONTH(e.date), SUM(e.amount) FROM Expense e WHERE YEAR(e.date) = :year GROUP BY MONTH(e.date)")
    List<Object[]> sumAmountByMonth(@Param("year") int year);

    @Query("SELECT COUNT(DISTINCT e.category) FROM Expense e")
    Long countDistinctCategories();

    // --- Duplicate Detection ---
    boolean existsByUserAndAmountAndDateAndDescription(User user, double amount, java.time.LocalDate date,
            String description);

    // --- Flagged Duplicates for Manager ---
    @Query("SELECT e FROM Expense e WHERE e.user IN :users AND e.isDuplicate = true")
    List<Expense> findByUserInAndIsDuplicateTrue(@Param("users") List<User> users);

    // --- Forwarded to Admin ---
    Page<Expense> findByStatusIn(List<Approval_Status> statuses, Pageable pageable);

    // --- Team Monthly Spend ---
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user IN :users " +
            "AND MONTH(e.date) = :month AND YEAR(e.date) = :year")
    Double sumAmountByUserInAndMonth(@Param("users") List<User> users,
            @Param("month") int month,
            @Param("year") int year);

    // --- TOP Teams spend by month (admin dashboard) ---
    @Query("SELECT e.user.team.name, SUM(e.amount) as total FROM Expense e " +
            "WHERE MONTH(e.date) = :month AND YEAR(e.date) = :year " +
            "AND e.user.team IS NOT NULL " +
            "GROUP BY e.user.team.name ORDER BY total DESC")
    List<Object[]> findTopTeamsByMonth(@Param("month") int month, @Param("year") int year);
}
