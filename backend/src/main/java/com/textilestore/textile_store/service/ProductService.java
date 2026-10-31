
package com.textilestore.textile_store.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.textilestore.textile_store.entity.Category;
import com.textilestore.textile_store.entity.Product;
import com.textilestore.textile_store.repository.CategoryRepository;
import com.textilestore.textile_store.repository.ProductRepository;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Product createProduct(Product product) {
        validateProduct(product);

        Long categoryId = product.getCategory().getId();

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Category not found with ID: " + categoryId));

        product.setCategory(category);

        return productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Product not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Product> searchProducts(String name) {
        if (name == null || name.isBlank()) {
            return getAllProducts();
        }

        return productRepository.findByNameContainingIgnoreCase(
                name.trim());
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new IllegalArgumentException(
                    "Category not found with ID: " + categoryId);
        }

        return productRepository.findByCategoryId(categoryId);
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsByMaterial(String material) {
        if (material == null || material.isBlank()) {
            throw new IllegalArgumentException(
                    "Material is required");
        }

        return productRepository.findByMaterialIgnoreCase(
                material.trim());
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        validateProduct(updatedProduct);

        Product existingProduct = getProductById(id);

        Long categoryId = updatedProduct.getCategory().getId();

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Category not found with ID: " + categoryId));

        existingProduct.setName(updatedProduct.getName().trim());
        existingProduct.setMaterial(updatedProduct.getMaterial().trim());
        existingProduct.setColor(updatedProduct.getColor());
        existingProduct.setPricePerMetre(
                updatedProduct.getPricePerMetre());
        existingProduct.setStockMetres(
                updatedProduct.getStockMetres());
        existingProduct.setImageUrl(updatedProduct.getImageUrl());
        existingProduct.setDescription(
                updatedProduct.getDescription());
        existingProduct.setCategory(category);

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    private void validateProduct(Product product) {
        if (product == null
                || product.getName() == null
                || product.getName().isBlank()) {
            throw new IllegalArgumentException(
                    "Product name is required");
        }

        if (product.getMaterial() == null
                || product.getMaterial().isBlank()) {
            throw new IllegalArgumentException(
                    "Product material is required");
        }

        if (product.getPricePerMetre() == null
                || product.getPricePerMetre()
                        .compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Price per metre must be greater than zero");
        }

        if (product.getStockMetres() == null
                || product.getStockMetres()
                        .compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Stock cannot be negative");
        }

        if (product.getCategory() == null
                || product.getCategory().getId() == null) {
            throw new IllegalArgumentException(
                    "Category ID is required");
        }
    }
}
