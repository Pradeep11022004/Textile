
package com.textilestore.textile_store.repository;

import java.util.List;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;

import com.textilestore.textile_store.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByMaterialIgnoreCase(String material);

    List<Product> findByStockMetresGreaterThan(BigDecimal stockMetres);
}
