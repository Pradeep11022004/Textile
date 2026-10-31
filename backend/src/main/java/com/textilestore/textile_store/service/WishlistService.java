
package com.textilestore.textile_store.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.textilestore.textile_store.dto.WishlistResponse;
import com.textilestore.textile_store.entity.Product;
import com.textilestore.textile_store.entity.User;
import com.textilestore.textile_store.entity.UserRole;
import com.textilestore.textile_store.entity.Wishlist;
import com.textilestore.textile_store.repository.ProductRepository;
import com.textilestore.textile_store.repository.UserRepository;
import com.textilestore.textile_store.repository.WishlistRepository;

@Service
@Transactional
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistService(
            WishlistRepository wishlistRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {

        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // Add product to wishlist
    public WishlistResponse addToWishlist(Long userId, Long productId) {

        User user = getCustomer(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Product not found"));

        // Prevent duplicate products
        return wishlistRepository.findByUserIdAndProductId(userId, productId)
                .map(WishlistResponse::new)
                .orElseGet(() -> {
                    Wishlist wishlist = new Wishlist(user, product);
                    Wishlist savedWishlist = wishlistRepository.save(wishlist);
                    return new WishlistResponse(savedWishlist);
                });
    }

    // Get customer's wishlist
    @Transactional(readOnly = true)
    public List<WishlistResponse> getWishlist(Long userId) {

        getCustomer(userId);

        return wishlistRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(WishlistResponse::new)
                .toList();
    }

    // Remove product from wishlist
    public void removeFromWishlist(Long userId, Long productId) {

        getCustomer(userId);

        Wishlist wishlist = wishlistRepository
                .findByUserIdAndProductId(userId, productId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Product not found in wishlist"));

        wishlistRepository.delete(wishlist);
    }

    // Check whether product exists in wishlist
    @Transactional(readOnly = true)
    public boolean isProductInWishlist(Long userId, Long productId) {

        getCustomer(userId);

        return wishlistRepository
                .existsByUserIdAndProductId(userId, productId);
    }

    // Validate customer
    private User getCustomer(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        if (!user.isEnabled()) {
            throw new IllegalArgumentException("User account is disabled");
        }

        if (user.getRole() != UserRole.CUSTOMER) {
            throw new IllegalArgumentException(
                    "Only customers can use wishlist");
        }

        return user;
    }
}
