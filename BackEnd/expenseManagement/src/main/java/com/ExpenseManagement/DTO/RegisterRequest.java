package com.expensemanagement.dto;

import com.expensemanagement.entities.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private String token; // optional invite token
}
