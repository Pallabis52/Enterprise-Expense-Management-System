package com.expensemanagement.controller;

import com.expensemanagement.entities.Category;
import com.expensemanagement.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Category CRUD — accessible to all authenticated roles.
 * GET/POST/PUT/DELETE /api/categories
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /** GET /api/categories */
    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    /** POST /api/categories */
    @PostMapping
    public ResponseEntity<Category> create(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    /** PUT /api/categories/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    /** DELETE /api/categories/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    /** PATCH /api/categories/{id}/toggle */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Category> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.toggleCategoryActive(id));
    }
}
