package com.expensemanagement.Notification;

import com.expensemanagement.Entities.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type; // INFO, WARNING, ACTION, SUCCESS

    @Enumerated(EnumType.STRING)
    private Role targetRole; // If null, user specific

    private Long userId; // If null, role specific

    @Column(name = "is_read")
    @Builder.Default
    private boolean read = false;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private NotificationCategory category;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.category == null) {
            this.category = NotificationCategory.GENERAL;
        }
    }

    public enum NotificationType {
        INFO, WARNING, ACTION, SUCCESS
    }

    public enum NotificationCategory {
        GENERAL, EXPENSE, TEAM, POLICY, SYSTEM, BUDGET
    }
}
