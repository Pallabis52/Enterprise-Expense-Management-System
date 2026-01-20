package com.ExpenseManagement.DTO;

import com.ExpenseManagement.Entities.Role;
import lombok.Data;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private Role role;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String name;
        private String email;
        private Role role;

        public AuthResponse(String token, String name, String email, Role role) {
            this.token = token;
            this.name = name;
            this.role = role;
            this.email = email;
        }
    }
}
