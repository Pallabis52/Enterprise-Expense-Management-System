package com.expensemanagement.Notification;

import com.expensemanagement.Entities.Role;
import com.expensemanagement.Entities.User;
import com.expensemanagement.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public List<Notification> getUserNotifications(Long userId, Role role) {
        return notificationRepository.findForUser(userId, role);
    }

    @Transactional
    public void markNotificationAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId, Role role) {
        notificationRepository.markAllAsRead(userId, role);
    }

    // --- Sending Logic ---

    // Notify a specific user
    public void notifyUser(Long userId, String title, String message, Notification.NotificationType type,
            Notification.NotificationCategory category) {
        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .type(type)
                .category(category)
                .userId(userId)
                .build();

        notificationRepository.save(notification);

        // Real-time
        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId), // Assuming Principal Name is ID, or need to mapping logic if Principal is Email
                "/queue/notifications",
                notification);
        // Note: For convertAndSendToUser to work with IDs, UserDestinationResolver
        // needs to map it.
        // Often simpler to just broadcast to a topic like /topic/user/{id} for this
        // scale.
        messagingTemplate.convertAndSend("/topic/user/" + userId, notification);
    }

    // Notify all users with a specific role (e.g., ADM INS)
    public void notifyRole(Role role, String title, String message, Notification.NotificationType type,
            Notification.NotificationCategory category) {
        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .type(type)
                .category(category)
                .targetRole(role)
                .build();

        notificationRepository.save(notification);

        // Real-time broadcast to role topic
        messagingTemplate.convertAndSend("/topic/role/" + role.name(), notification);
    }
}
