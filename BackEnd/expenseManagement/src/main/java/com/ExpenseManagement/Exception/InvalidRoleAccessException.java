package com.expensemanagement.exception;

public class InvalidRoleAccessException extends RuntimeException {
    public InvalidRoleAccessException(String message) {
        super(message);
    }
}
