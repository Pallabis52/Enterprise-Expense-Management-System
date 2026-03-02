package com.expensemanagement.dto;

import com.expensemanagement.entities.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ComplaintDTO {
    private Long id;
    private String title;
    private String description;
    private Complaint_Status status;
    private Complaint_Category category;
    private Complaint_Priority priority;
    private Complaint_Sentiment sentiment;
    private Complaint_Department assignedDepartment;
    private Long expenseId;
    private int riskScore;
    private boolean isDuplicate;
    private String response;
    private String createdBy;
    private String assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class Request {
        private String title;
        private String description;
        private Complaint_Category category;
        private Long expenseId;
    }

    @Data
    public static class ResponseUpdate {
        private String response;
    }
}
