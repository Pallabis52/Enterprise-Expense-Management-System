package com.expensemanagement.controller;

import com.expensemanagement.dto.ComplaintDTO;
import com.expensemanagement.entities.Complaint;
import com.expensemanagement.entities.Complaint_Status;
import com.expensemanagement.entities.User;
import com.expensemanagement.services.ComplaintService;
import com.expensemanagement.services.UserService;
import com.expensemanagement.services.ComplaintAIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;
    private final UserService userService;
    private final ComplaintAIService complaintAIService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'MANAGER')")
    public ResponseEntity<?> createComplaint(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ComplaintDTO.Request request) {

        try {
            User user = userService.getUserByEmail(userDetails.getUsername());
            Complaint complaint = new Complaint();
            complaint.setTitle(request.getTitle());
            complaint.setDescription(request.getDescription());
            complaint.setCategory(request.getCategory());
            complaint.setExpenseId(request.getExpenseId());

            return ResponseEntity.ok(complaintService.createComplaint(user, complaint));
        } catch (Exception e) {
            log.error("Error creating complaint: {}", e.getMessage(), e);
            java.io.StringWriter sw = new java.io.StringWriter();
            java.io.PrintWriter pw = new java.io.PrintWriter(sw);
            e.printStackTrace(pw);
            String stackTrace = sw.toString();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of(
                            "message", "Structural anomaly detected: " + e.getMessage(),
                            "stackTrace", stackTrace,
                            "error", "Internal Server Error"));
        }
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'MANAGER', 'ADMIN')")
    public ResponseEntity<List<ComplaintDTO>> getMyComplaints(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(complaintService.getUserComplaints(user));
    }

    @GetMapping("/team")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<ComplaintDTO>> getTeamComplaints() {
        return ResponseEntity.ok(complaintService.getManagerComplaints());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComplaintDTO>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAdminComplaints());
    }

    @PostMapping("/respond/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ComplaintDTO> respondToComplaint(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody ComplaintDTO.ResponseUpdate update) {

        User responder = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(complaintService.respondToComplaint(responder, id, update.getResponse()));
    }

    @PostMapping("/close/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplaintDTO> closeComplaint(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.closeComplaint(id));
    }

    @PostMapping("/escalate/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ComplaintDTO> escalateComplaint(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.escalateComplaint(id));
    }

    @GetMapping("/suggest")
    public ResponseEntity<?> suggestSolutions(@RequestParam String text) {
        return complaintAIService.suggestSolutions(text)
                .thenApply(ResponseEntity::ok)
                .join();
    }

    @GetMapping("/{id}/ai-reply")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<?> suggestReply(@PathVariable Long id) {
        ComplaintDTO complaint = complaintService.getById(id);

        return complaintAIService.suggestResponse(complaint.getTitle(), complaint.getDescription())
                .thenApply(ResponseEntity::ok)
                .join();
    }

    @PostMapping("/voice")
    @PreAuthorize("hasAnyRole('USER', 'MANAGER')")
    public ResponseEntity<?> createVoiceComplaint(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody java.util.Map<String, String> body) {

        String transcript = body.get("transcript");
        User user = userService.getUserByEmail(userDetails.getUsername());

        Complaint complaint = new Complaint();
        complaint.setTitle(
                "Voice Submission: " + (transcript.length() > 20 ? transcript.substring(0, 20) + "..." : transcript));
        complaint.setDescription(transcript);

        com.expensemanagement.dto.ComplaintDTO saved = complaintService.createComplaint(user, complaint);
        return ResponseEntity.ok(saved);
    }
}
