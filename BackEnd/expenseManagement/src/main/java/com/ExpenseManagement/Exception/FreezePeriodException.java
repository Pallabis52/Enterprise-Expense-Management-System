package com.expensemanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a user attempts to submit an expense during a locked freeze
 * period.
 * Handled by GlobalExceptionHandler → returns HTTP 403.
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class FreezePeriodException extends RuntimeException {
    public FreezePeriodException(String message) {
        super(message);
    }
}
