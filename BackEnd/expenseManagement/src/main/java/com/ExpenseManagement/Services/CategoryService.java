package com.expensemanagement.Services;

import com.expensemanagement.Entities.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();

    Category createCategory(Category category);

    Category updateCategory(Long id, Category category);

    void deleteCategory(Long id);

    Category getCategoryById(Long id);

    Category toggleCategoryActive(Long id);
}
