
package com.textilestore.textile_store.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.textilestore.textile_store.entity.Category;
import com.textilestore.textile_store.repository.CategoryRepository;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category createCategory(Category category) {

        if (category.getName() == null
                || category.getName().isBlank()) {
            throw new IllegalArgumentException(
                    "Category name is required");
        }

        String name = category.getName().trim();

        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException(
                    "Category already exists");
        }

        category.setName(name);

        return categoryRepository.save(category);
    }

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Category not found with ID: " + id));
    }

    public Category updateCategory(Long id, Category updatedCategory) {
        Category existingCategory = getCategoryById(id);

        if (updatedCategory.getName() == null
                || updatedCategory.getName().isBlank()) {
            throw new IllegalArgumentException(
                    "Category name is required");
        }

        String name = updatedCategory.getName().trim();

        if (!existingCategory.getName().equalsIgnoreCase(name)
                && categoryRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException(
                    "Category already exists");
        }

        existingCategory.setName(name);
        existingCategory.setDescription(
                updatedCategory.getDescription());

        return categoryRepository.save(existingCategory);
    }

    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
