package com.expensemanagement.controller;

import com.expensemanagement.entities.User;
import com.expensemanagement.services.UserService;
import com.expensemanagement.services.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;
    private final UserService userService;

    @GetMapping("/suggest")
    public ResponseEntity<List<String>> getSuggestions(@RequestParam String query) {
        return ResponseEntity.ok(vendorService.getVendorSuggestions(query));
    }

    @GetMapping("/insights/{vendorName}")
    public ResponseEntity<Map<String, Object>> getInsights(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String vendorName) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(vendorService.getVendorInsights(vendorName, user.getId()));
    }

    @GetMapping("/frequent")
    public ResponseEntity<List<String>> getFrequent(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(vendorService.getFrequentVendors(user.getId()));
    }

    @PostMapping("/check-amount")
    public ResponseEntity<Map<String, Boolean>> checkAmount(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body) {

        User user = userService.getUserByEmail(userDetails.getUsername());
        String vendorName = (String) body.get("vendorName");
        Double amount = Double.valueOf(body.get("amount").toString());

        boolean suspicious = vendorService.isAmountSuspicious(vendorName, amount, user.getId());
        return ResponseEntity.ok(Map.of("suspicious", suspicious));
    }
}
