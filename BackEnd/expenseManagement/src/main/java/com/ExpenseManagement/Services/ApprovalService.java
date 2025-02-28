//package com.ExpenseManagement.Services;
//
//import java.util.Optional;
//
//import org.springframework.stereotype.Service;
//
//import com.ExpenseManagement.Entities.Approval_Status;
//import com.ExpenseManagement.Entities.Expense;
//import com.ExpenseManagement.Repository.ExpenseRepository;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class ApprovalService {
//    private final ExpenseRepository expenseRepository;
//
//    public Expense approveExpense(long id, String role) {
//        Optional<Expense> getexpense = expenseRepository.findById(id);
//        if (getexpense.isEmpty()) {
//            throw new RuntimeException("Expense not found");
//        }
//        Expense expense = getexpense.get();
//        switch (role.toUpperCase()) {
//            case "MANAGER":
//                expense.setStatus(Approval_Status.APPROVED_BY_MANAGER);
//                break;
//
//            case "FINANCE":
//                if (expense.getStatus().equals(Approval_Status.APPROVED_BY_MANAGER)) {
//                    expense.setStatus(Approval_Status.APPROVED_BY_FINANCE);
//                } else {
//                    throw new RuntimeException("Must approved by manager");
//                }
//                break;
//
//            case "ADMIN":
//                if (expense.getStatus().equals(Approval_Status.APPROVED_BY_FINANCE)) {
//                    expense.setStatus(Approval_Status.APPROVED);
//                } else {
//                    throw new RuntimeException("Must approved by finance");
//                }
//                break;
//
//            default:
//                throw new RuntimeException("Invalid Role");
//        }
//        return expenseRepository.save(expense);
//    }
//}
