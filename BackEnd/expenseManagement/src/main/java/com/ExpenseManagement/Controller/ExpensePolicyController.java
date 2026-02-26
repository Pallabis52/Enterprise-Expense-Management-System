package com.expensemanagement.Controller;

import com.expensemanagement.entities.ExpensePolicy;
import com.expensemanagement.services.ExpensePolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ExpensePolicyController {

    private final ExpensePolicyService policyService;

    // --- Admin Endpoints ---

    @GetMapping("/admin/policies")
    public ResponseEntity<List<ExpensePolicy>> getAllPolicies() {
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    @PostMapping("/admin/policies")
    public ResponseEntity<ExpensePolicy> createPolicy(@RequestBody ExpensePolicy policy) {
        return ResponseEntity.ok(policyService.createPolicy(policy));
    }

    @PutMapping("/admin/policies/{id}")
    public ResponseEntity<ExpensePolicy> updatePolicy(@PathVariable Long id, @RequestBody ExpensePolicy policy) {
        return ResponseEntity.ok(policyService.updatePolicy(id, policy));
    }

    @DeleteMapping("/admin/policies/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }

    // --- Manager Endpoints ---

    @GetMapping("/manager/policies")
    public ResponseEntity<List<ExpensePolicy>> getActivePolicies() {
        return ResponseEntity.ok(policyService.getActivePolicies());
    }

    @PostMapping("/manager/policies")
    public ResponseEntity<ExpensePolicy> createPolicyManager(@RequestBody ExpensePolicy policy) {
        // Managers can also create policies
        return ResponseEntity.ok(policyService.createPolicy(policy));
    }
}
