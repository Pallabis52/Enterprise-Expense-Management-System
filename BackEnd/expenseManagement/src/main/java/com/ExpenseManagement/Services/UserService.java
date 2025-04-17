package com.ExpenseManagement.Services;

public interface UserService {

    String login(String username, String password);

    String signup(String name, String username, String password);

}
