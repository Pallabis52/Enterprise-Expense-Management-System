package com.expensemanagement.Services;

import com.expensemanagement.DTO.Invite.InviteRequest;
import com.expensemanagement.Entities.InviteToken;
import com.expensemanagement.Entities.Role;
import com.expensemanagement.Repository.InviteTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InviteService {

    private final InviteTokenRepository inviteRepository;

    public InviteToken createInvite(InviteRequest request, Long requestingUserId, Role requestingUserRole) {
        // Validation handled by Controller or here
        if (requestingUserRole == Role.MANAGER && request.getRole() != Role.USER) {
            throw new RuntimeException("Managers can only invite Users.");
        }

        // Check if pending invite exists
        inviteRepository.findByEmailAndStatus(request.getEmail(), InviteToken.InviteStatus.PENDING).ifPresent(i -> {
            throw new RuntimeException("Pending invite already sends to this email.");
        });

        InviteToken token = InviteToken.builder()
                .email(request.getEmail())
                .role(request.getRole())
                .managerId(request.getManagerId() != null ? request.getManagerId()
                        : (requestingUserRole == Role.MANAGER ? requestingUserId : null))
                .token(UUID.randomUUID().toString())
                .status(InviteToken.InviteStatus.PENDING)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();

        InviteToken saved = inviteRepository.save(token);

        // Mock Send Email
        System.out.println("------------------------------------------------");
        System.out.println("SENDING INVITE TO: " + request.getEmail());
        System.out.println("LINK: http://localhost:5173/register?token=" + saved.getToken());
        System.out.println("------------------------------------------------");

        return saved;
    }

    public InviteToken validateToken(String token) {
        InviteToken invite = inviteRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (invite.getStatus() != InviteToken.InviteStatus.PENDING) {
            throw new RuntimeException("Token already used or expired");
        }
        if (invite.getExpiryDate().isBefore(LocalDateTime.now())) {
            invite.setStatus(InviteToken.InviteStatus.EXPIRED);
            inviteRepository.save(invite);
            throw new RuntimeException("Token expired");
        }
        return invite;
    }

    @org.springframework.beans.factory.annotation.Autowired
    private com.expensemanagement.Notification.NotificationService notificationService;

    public void acceptInvite(String token) {
        InviteToken invite = validateToken(token);
        invite.setStatus(InviteToken.InviteStatus.ACCEPTED);
        inviteRepository.save(invite);

        if (invite.getManagerId() != null) {
            notificationService.notifyUser(
                    invite.getManagerId(),
                    "Invitation Accepted",
                    "The invitation sent to " + invite.getEmail() + " has been accepted.",
                    com.expensemanagement.Notification.Notification.NotificationType.SUCCESS,
                    com.expensemanagement.Notification.Notification.NotificationCategory.TEAM);
        }
    }
}
