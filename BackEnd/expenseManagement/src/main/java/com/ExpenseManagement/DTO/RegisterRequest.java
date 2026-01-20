package com.ExpenseManagement.DTO;

import com.ExpenseManagement.Entities.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}
