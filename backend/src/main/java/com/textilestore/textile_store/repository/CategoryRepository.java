
package com.textilestore.textile_store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.textilestore.textile_store.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByNameIgnoreCase(String name);
}
