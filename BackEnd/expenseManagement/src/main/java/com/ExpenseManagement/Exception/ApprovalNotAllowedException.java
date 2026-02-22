package com.expensemanagement.Exception;

public class ApprovalNotAllowedException extends RuntimeException {
    public ApprovalNotAllowedException(String message) {
        super(message);
    }
}
