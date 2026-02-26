package com.expensemanagement.exception;

public class DependencyMissingException extends RuntimeException {
    public DependencyMissingException(String message) {
        super(message);
    }
}
