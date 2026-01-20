package com.ExpenseManagement.DTO.Invite;

import com.ExpenseManagement.Entities.Role;
import lombok.Data;

@Data
public class InviteRequest {
    private String email;
    private Role role;
    private Long managerId; // Optional, defaults to inviter if MANAGER
}
