package com.ExpenseManagement.Controller;

import com.ExpenseManagement.Entities.ExpensePolicy;
import com.ExpenseManagement.Services.ExpensePolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExpensePolicyController {

    private final ExpensePolicyService policyService;

    // Admin Endpoints
    @GetMapping("/admin/policies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ExpensePolicy>> getAllPolicies() {
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    @PostMapping("/admin/policies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExpensePolicy> createPolicy(@RequestBody ExpensePolicy policy) {
        return ResponseEntity.ok(policyService.createPolicy(policy));
    }

    @PutMapping("/admin/policies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExpensePolicy> updatePolicy(@PathVariable Long id, @RequestBody ExpensePolicy policy) {
        return ResponseEntity.ok(policyService.updatePolicy(id, policy));
    }

    @DeleteMapping("/admin/policies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.ok().build();
    }

    // Manager / User Endpoints
    @GetMapping("/manager/policies")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<ExpensePolicy>> getActivePoliciesForManager() {
        return ResponseEntity.ok(policyService.getActivePolicies());
    }

    // Public/User endpoint for validation? Maybe just use the same as manager or
    // create a specific user one.
    // For now, Managers need to view active policies.
}
