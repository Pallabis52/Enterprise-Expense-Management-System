package com.expensemanagement.DTO;

import com.expensemanagement.Entities.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}
