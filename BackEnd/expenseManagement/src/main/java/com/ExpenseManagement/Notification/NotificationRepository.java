package com.expensemanagement.Notification;

import com.expensemanagement.Entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Find notifications for a specific user OR for their role (if userId is null)
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId OR (n.targetRole = :role AND n.userId IS NULL) ORDER BY n.createdAt DESC")
    List<Notification> findForUser(@Param("userId") Long userId, @Param("role") Role role);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.userId = :userId OR (n.targetRole = :role AND n.userId IS NULL)")
    void markAllAsRead(@Param("userId") Long userId, @Param("role") Role role);
}
