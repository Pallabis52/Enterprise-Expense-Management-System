package com.expensemanagement.Services;

import com.expensemanagement.Entities.User;
import com.expensemanagement.Entities.Approval_Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class VoiceApprovalService {

    private final ManagerService managerService;

    public String processManagerAction(String text, User manager) {
        String lowerText = text.toLowerCase();

        // Extract ID
        Pattern pattern = Pattern.compile("\\d+");
        Matcher matcher = pattern.matcher(text);
        Long expenseId = null;
        if (matcher.find()) {
            expenseId = Long.parseLong(matcher.group());
        }

        if (expenseId == null) {
            return "I couldn't find an expense ID in your command. Please say 'Approve expense 123'.";
        }

        if (lowerText.contains("approve")) {
            try {
                managerService.approveExpense(expenseId, manager.getId());
                return "Successfully approved expense #" + expenseId;
            } catch (Exception e) {
                return "Failed to approve expense #" + expenseId + ": " + e.getMessage();
            }
        } else if (lowerText.contains("reject")) {
            try {
                // For simplicity, we use a default reason if not provided in text
                String reason = "Rejected via voice command";
                if (lowerText.contains("reason")) {
                    reason = text.substring(lowerText.indexOf("reason") + 6).trim();
                }
                managerService.rejectExpense(expenseId, reason);
                return "Successfully rejected expense #" + expenseId;
            } catch (Exception e) {
                return "Failed to reject expense #" + expenseId + ": " + e.getMessage();
            }
        }

        return "I understood the ID #" + expenseId
                + " but couldn't determine if you wanted to approve or reject. Please try again.";
    }
}
