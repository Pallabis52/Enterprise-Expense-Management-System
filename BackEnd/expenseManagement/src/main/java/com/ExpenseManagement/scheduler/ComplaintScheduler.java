package com.expensemanagement.scheduler;

import com.expensemanagement.dto.ComplaintDTO;
import com.expensemanagement.entities.Complaint_Priority;
import com.expensemanagement.entities.Complaint_Status;
import com.expensemanagement.services.ComplaintService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ComplaintScheduler {

    private final ComplaintService complaintService;

    /**
     * Runs every hour to check for stagnant complaints.
     * Rules:
     * - 24 hrs -> Log reminder (in a real system, send email/notification)
     * - 48 hrs -> Escalate to Admin
     * - 72 hrs -> Mark as Critical
     */
    @Scheduled(cron = "0 0 * * * *") // Every hour
    public void processEscalations() {
        log.info("Complaint Scheduler: Scanning for stagnant complaints...");

        List<Complaint_Status> activeStatuses = Arrays.asList(
                Complaint_Status.SUBMITTED,
                Complaint_Status.UNDER_REVIEW);

        List<ComplaintDTO> activeComplaints = complaintService.getComplaintsByStatus(activeStatuses);
        LocalDateTime now = LocalDateTime.now();

        for (ComplaintDTO complaint : activeComplaints) {
            LocalDateTime created = complaint.getCreatedAt();
            if (created == null)
                continue;

            if (created.isBefore(now.minusHours(72))) {
                if (complaint.getPriority() != Complaint_Priority.CRITICAL) {
                    log.info("SCHEDULER: Auto-Critical - Complaint #{}", complaint.getId());
                    complaintService.updateField(complaint.getId(), c -> c.setPriority(Complaint_Priority.CRITICAL));
                }
            } else if (created.isBefore(now.minusHours(48))) {
                if (complaint.getStatus() != Complaint_Status.ESCALATED) {
                    log.info("SCHEDULER: Auto-Escalate - Complaint #{}", complaint.getId());
                    complaintService.escalateComplaint(complaint.getId());
                }
            } else if (created.isBefore(now.minusHours(24))) {
                log.info("SCHEDULER: 24h Reminder for Complaint #{}", complaint.getId());
                // In a real app, send notification here.
            }
        }
    }
}
