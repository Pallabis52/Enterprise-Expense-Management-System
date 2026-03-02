package com.expensemanagement.services;

import com.expensemanagement.entities.Complaint;
import com.expensemanagement.entities.Complaint_Status;
import com.expensemanagement.entities.User;
import com.expensemanagement.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public Complaint createComplaint(User user, Complaint complaint) {
        complaint.setCreatedBy(user);
        complaint.setRoleLevel(user.getRole().toString());
        complaint.setStatus(Complaint_Status.OPEN);
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getUserComplaints(User user) {
        return complaintRepository.findByCreatedBy(user);
    }

    public List<Complaint> getManagerComplaints() {
        // Managers see complaints from USERs
        return complaintRepository.findByRoleLevel("USER");
    }

    public List<Complaint> getAdminComplaints() {
        // Admins see everything
        return complaintRepository.findAll();
    }

    @Transactional
    public Complaint respondToComplaint(User responder, Long id, String response) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setResponse(response);
        complaint.setStatus(Complaint_Status.IN_PROGRESS);
        complaint.setAssignedTo(responder);
        return complaintRepository.save(complaint);
    }

    @Transactional
    public Complaint closeComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(Complaint_Status.CLOSED);
        return complaintRepository.save(complaint);
    }
}
