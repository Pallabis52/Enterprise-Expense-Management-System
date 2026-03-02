package com.expensemanagement.services;

import com.expensemanagement.entities.Complaint;
import com.expensemanagement.entities.Complaint_Status;
import com.expensemanagement.entities.Complaint_Priority;
import com.expensemanagement.entities.Complaint_Sentiment;
import com.expensemanagement.entities.Complaint_Department;
import com.expensemanagement.entities.User;
import com.expensemanagement.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintAIService complaintAIService;

    @Transactional
    public com.expensemanagement.dto.ComplaintDTO createComplaint(User user, Complaint complaint) {
        // 1. Duplicate Detection
        if (isDuplicate(user, complaint.getTitle(), complaint.getDescription())) {
            complaint.setDuplicate(true);
        }

        complaint.setCreatedBy(user);
        complaint.setRoleLevel(user.getRole().toString());
        complaint.setStatus(Complaint_Status.SUBMITTED);

        Complaint saved = complaintRepository.save(complaint);

        // 2. AI Analysis (Non-blocking)
        triggerAIAnalysis(saved);

        return convertToDTO(saved);
    }

    private void triggerAIAnalysis(Complaint complaint) {
        complaintAIService.detectPriority(complaint.getTitle(), complaint.getDescription())
                .thenAccept(p -> updateField(complaint.getId(), c -> {
                    c.setPriority(p);
                    if (p == Complaint_Priority.CRITICAL || p == Complaint_Priority.HIGH) {
                        c.setStatus(Complaint_Status.UNDER_REVIEW);
                    }
                }));

        complaintAIService.detectSentiment(complaint.getTitle(), complaint.getDescription())
                .thenAccept(s -> updateField(complaint.getId(), c -> c.setSentiment(s)));

        complaintAIService.classifyDepartment(complaint.getTitle(), complaint.getDescription())
                .thenAccept(d -> updateField(complaint.getId(), c -> c.setAssignedDepartment(d)));

        complaintAIService.detectRiskScore(complaint.getTitle(), complaint.getDescription())
                .thenAccept(score -> updateField(complaint.getId(), c -> c.setRiskScore(score)));
    }

    @Transactional
    public void updateField(Long id, java.util.function.Consumer<Complaint> updater) {
        complaintRepository.findById(id).ifPresent(c -> {
            updater.accept(c);
            complaintRepository.save(c);
        });
    }

    private boolean isDuplicate(User user, String title, String desc) {
        List<Complaint> recent = complaintRepository.findTop10ByCreatedByOrderByCreatedAtDesc(user);
        String combined = (title + " " + desc).toLowerCase();
        for (Complaint c : recent) {
            String oldCombined = (c.getTitle() + " " + c.getDescription()).toLowerCase();
            if (calculateSimilarity(combined, oldCombined) > 0.85)
                return true;
        }
        return false;
    }

    private double calculateSimilarity(String s1, String s2) {
        Set<String> words1 = Arrays.stream(s1.split("\\W+")).filter(w -> w.length() > 2).collect(Collectors.toSet());
        Set<String> words2 = Arrays.stream(s2.split("\\W+")).filter(w -> w.length() > 2).collect(Collectors.toSet());
        if (words1.isEmpty() || words2.isEmpty())
            return 0;
        long common = words1.stream().filter(words2::contains).count();
        return (double) common / Math.max(words1.size(), words2.size());
    }

    @Transactional(readOnly = true)
    public List<com.expensemanagement.dto.ComplaintDTO> getUserComplaints(User user) {
        return complaintRepository.findByCreatedBy(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<com.expensemanagement.dto.ComplaintDTO> getManagerComplaints() {
        return complaintRepository.findByRoleLevel("USER").stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<com.expensemanagement.dto.ComplaintDTO> getAdminComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public com.expensemanagement.dto.ComplaintDTO respondToComplaint(User responder, Long id, String response) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setResponse(response);
        complaint.setStatus(Complaint_Status.UNDER_REVIEW);
        complaint.setAssignedTo(responder);
        return convertToDTO(complaintRepository.save(complaint));
    }

    @Transactional
    public com.expensemanagement.dto.ComplaintDTO closeComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(Complaint_Status.RESOLVED);
        return convertToDTO(complaintRepository.save(complaint));
    }

    @Transactional
    public com.expensemanagement.dto.ComplaintDTO escalateComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(Complaint_Status.ESCALATED);
        complaint.setPriority(Complaint_Priority.CRITICAL);
        return convertToDTO(complaintRepository.save(complaint));
    }

    @Transactional(readOnly = true)
    public List<com.expensemanagement.dto.ComplaintDTO> getComplaintsByStatus(List<Complaint_Status> statuses) {
        return complaintRepository.findAll().stream()
                .filter(c -> statuses.contains(c.getStatus()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public com.expensemanagement.dto.ComplaintDTO getById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        return convertToDTO(complaint);
    }

    private com.expensemanagement.dto.ComplaintDTO convertToDTO(Complaint complaint) {
        com.expensemanagement.dto.ComplaintDTO dto = new com.expensemanagement.dto.ComplaintDTO();
        dto.setId(complaint.getId());
        dto.setTitle(complaint.getTitle());
        dto.setDescription(complaint.getDescription());
        dto.setStatus(complaint.getStatus());
        dto.setCategory(complaint.getCategory());
        dto.setPriority(complaint.getPriority());
        dto.setSentiment(complaint.getSentiment());
        dto.setAssignedDepartment(complaint.getAssignedDepartment());
        dto.setExpenseId(complaint.getExpenseId());
        dto.setRiskScore(complaint.getRiskScore());
        dto.setDuplicate(complaint.isDuplicate());
        dto.setResponse(complaint.getResponse());

        if (complaint.getCreatedBy() != null) {
            dto.setCreatedBy(complaint.getCreatedBy().getEmail());
        }

        if (complaint.getAssignedTo() != null) {
            dto.setAssignedTo(complaint.getAssignedTo().getEmail());
        }

        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setUpdatedAt(complaint.getUpdatedAt());
        return dto;
    }
}
