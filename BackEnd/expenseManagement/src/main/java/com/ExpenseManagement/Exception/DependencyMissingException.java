package com.expensemanagement.Exception;

public class DependencyMissingException extends RuntimeException {
    public DependencyMissingException(String message) {
        super(message);
    }
}
