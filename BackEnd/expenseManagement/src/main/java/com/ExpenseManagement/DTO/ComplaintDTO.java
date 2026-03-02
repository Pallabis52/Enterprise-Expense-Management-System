package com.expensemanagement.dto;

import com.expensemanagement.entities.Complaint_Status;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ComplaintDTO {
    private Long id;
    private String title;
    private String description;
    private Complaint_Status status;
    private String response;
    private String createdBy;
    private String assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class Request {
        private String title;
        private String description;
    }

    @Data
    public static class ResponseUpdate {
        private String response;
    }
}
