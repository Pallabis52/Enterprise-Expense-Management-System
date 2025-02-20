package com.example.EXPENSE_BACKEND.models;

import jakarta.annotation.Generated;
import jakarta.persistence.*;

@Entity
@Table(name = "users") // Change table name to avoid conflict
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Employee_id;

    private String name;
    private String username;
    private String email;
    private String password;
    private String conformpassword;

    // Getters and setters



    public User() {

    }



    @Override
    public String toString() {
        return "User{" +
                "id=" + Employee_id +
                ", name='" + name + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", conformpassword='" + conformpassword + '\'' +
                '}';
    }



    public Long getId() {
        return Employee_id;
    }

    public void setId(Long id) {
        this.Employee_id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConformpassword() {
        return conformpassword;
    }

    public void setConformpassword(String conformpassword) {
        this.conformpassword = conformpassword;
    }


}
