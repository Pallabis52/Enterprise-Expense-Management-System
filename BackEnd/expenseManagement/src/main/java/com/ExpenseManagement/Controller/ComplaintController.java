package com.expensemanagement.controller;

import com.expensemanagement.dto.ComplaintDTO;
import com.expensemanagement.entities.Complaint;
import com.expensemanagement.entities.Complaint_Status;
import com.expensemanagement.entities.User;
import com.expensemanagement.services.ComplaintService;
import com.expensemanagement.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'MANAGER')")
    public ResponseEntity<ComplaintDTO> createComplaint(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ComplaintDTO.Request request) {

        User user = userService.getUserByEmail(userDetails.getUsername());
        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());

        Complaint saved = complaintService.createComplaint(user, complaint);
        return ResponseEntity.ok(convertToDTO(saved));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'MANAGER', 'ADMIN')")
    public ResponseEntity<List<ComplaintDTO>> getMyComplaints(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        List<Complaint> complaints = complaintService.getUserComplaints(user);
        return ResponseEntity.ok(complaints.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/team")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<ComplaintDTO>> getTeamComplaints() {
        List<Complaint> complaints = complaintService.getManagerComplaints();
        return ResponseEntity.ok(complaints.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComplaintDTO>> getAllComplaints() {
        List<Complaint> complaints = complaintService.getAdminComplaints();
        return ResponseEntity.ok(complaints.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @PostMapping("/respond/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ComplaintDTO> respondToComplaint(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody ComplaintDTO.ResponseUpdate update) {

        User responder = userService.getUserByEmail(userDetails.getUsername());
        Complaint updated = complaintService.respondToComplaint(responder, id, update.getResponse());
        return ResponseEntity.ok(convertToDTO(updated));
    }

    @PostMapping("/close/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplaintDTO> closeComplaint(@PathVariable Long id) {
        Complaint closed = complaintService.closeComplaint(id);
        return ResponseEntity.ok(convertToDTO(closed));
    }

    private ComplaintDTO convertToDTO(Complaint complaint) {
        ComplaintDTO dto = new ComplaintDTO();
        dto.setId(complaint.getId());
        dto.setTitle(complaint.getTitle());
        dto.setDescription(complaint.getDescription());
        dto.setStatus(complaint.getStatus());
        dto.setResponse(complaint.getResponse());
        dto.setCreatedBy(complaint.getCreatedBy().getEmail());
        dto.setAssignedTo(complaint.getAssignedTo() != null ? complaint.getAssignedTo().getEmail() : null);
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setUpdatedAt(complaint.getUpdatedAt());
        return dto;
    }
}
