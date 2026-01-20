package com.ExpenseManagement.Controller;

import com.ExpenseManagement.Entities.Category;
import com.ExpenseManagement.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private com.ExpenseManagement.Services.UserService userService;

    private com.ExpenseManagement.Entities.User getAuthenticatedUser() {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        String email;
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        return userService.getUserByEmail(email);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        com.ExpenseManagement.Entities.User user = getAuthenticatedUser();
        if (user.getRole() == com.ExpenseManagement.Entities.Role.ADMIN) {
            return categoryRepository.findAll();
        }
        return categoryRepository.findByAllowedRoleOrNull(user.getRole());
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id, @RequestBody Category category) {
        category.setId(id);
        return categoryRepository.save(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
