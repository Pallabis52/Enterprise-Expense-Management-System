package com.ExpenseManagement.Repository;

import com.ExpenseManagement.Entities.Role_Name;
import com.ExpenseManagement.Entities.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;


@Repository
public interface RolesRepo extends JpaRepository<Roles, Integer> {
    Roles findByName(Role_Name name);
}
