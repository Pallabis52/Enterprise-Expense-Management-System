package com.ExpenseManagement.DTO;

import com.ExpenseManagement.Entities.Approval_Status;
import com.ExpenseManagement.Entities.Expense_Category;
import com.ExpenseManagement.Entities.Users;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ExpenseDTO {
    private String title;
    private double amount;
    private String description;
    private LocalDate date;
    private String recipturl;
    private Expense_Category category;
    private Approval_Status status;
    private UserDTO user;
}
