package com.expensemanagement.Exception;

public class InvalidRoleAccessException extends RuntimeException {
    public InvalidRoleAccessException(String message) {
        super(message);
    }
}
