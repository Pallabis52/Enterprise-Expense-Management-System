package com.expensemanagement.dto.Invite;

import com.expensemanagement.entities.Role;
import lombok.Data;

@Data
public class InviteRequest {
    private String email;
    private Role role;
    private Long managerId; // Optional, defaults to inviter if MANAGER
}
