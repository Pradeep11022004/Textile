
package com.textilestore.textile_store.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.textilestore.textile_store.dto.WishlistResponse;
import com.textilestore.textile_store.service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // Add product to wishlist
    @PostMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<WishlistResponse> addToWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {

        WishlistResponse response =
                wishlistService.addToWishlist(userId, productId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get customer's wishlist
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WishlistResponse>> getWishlist(
            @PathVariable Long userId) {

        List<WishlistResponse> wishlist =
                wishlistService.getWishlist(userId);

        return ResponseEntity.ok(wishlist);
    }

    // Remove product from wishlist
    @DeleteMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {

        wishlistService.removeFromWishlist(userId, productId);

        return ResponseEntity.ok(
                Map.of("message", "Product removed from wishlist"));
    }

    // Check whether product is in wishlist
    @GetMapping("/user/{userId}/product/{productId}/exists")
    public ResponseEntity<Map<String, Boolean>> isProductInWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {

        boolean exists =
                wishlistService.isProductInWishlist(userId, productId);

        return ResponseEntity.ok(Map.of("exists", exists));
    }
}
