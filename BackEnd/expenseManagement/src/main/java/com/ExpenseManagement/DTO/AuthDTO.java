package com.expensemanagement.dto;

import com.expensemanagement.entities.Role;
import lombok.AllArgsConstructor;
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
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private UserInfo user;

        @Data
        @AllArgsConstructor
        public static class UserInfo {
            private Long id;
            private String name;
            private String email;
            private Role role;
        }
    }

}
