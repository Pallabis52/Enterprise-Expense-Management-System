package com.ExpenseManagement.DTO;

import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private String name;
    private String username;
    private List<String> roles;
}
