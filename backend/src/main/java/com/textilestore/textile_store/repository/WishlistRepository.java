
package com.textilestore.textile_store.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.textilestore.textile_store.entity.Wishlist;

@Repository
public interface WishlistRepository
        extends JpaRepository<Wishlist, Long> {

    // Get all wishlist items belonging to a customer.
    List<Wishlist> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Check whether a customer already saved a product.
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    // Find a particular customer's wishlist item.
    Optional<Wishlist> findByUserIdAndProductId(
            Long userId,
            Long productId
    );

    // Delete a particular customer's wishlist item.
    void deleteByUserIdAndProductId(Long userId, Long productId);

    // Count the wishlist items belonging to a customer.
    long countByUserId(Long userId);
}
