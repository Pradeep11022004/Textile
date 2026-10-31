
package com.textilestore.textile_store.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.textilestore.textile_store.entity.CartItem;
import com.textilestore.textile_store.entity.Product;
import com.textilestore.textile_store.entity.User;
import com.textilestore.textile_store.repository.CartItemRepository;
import com.textilestore.textile_store.repository.ProductRepository;
import com.textilestore.textile_store.repository.UserRepository;

@Service
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public CartItem addToCart(Long userId, Long productId,
                              BigDecimal quantityMetres) {

        validateQuantity(quantityMetres);

        User user = getUser(userId);
        Product product = getProduct(productId);

        if (product.getStockMetres().compareTo(quantityMetres) < 0) {
            throw new IllegalArgumentException(
                    "Insufficient stock available");
        }

        CartItem cartItem = cartItemRepository
                .findByUserIdAndProductId(userId, productId)
                .orElse(null);

        if (cartItem == null) {
            cartItem = new CartItem(
                    user, product, quantityMetres);
        } else {
            BigDecimal newQuantity = cartItem.getQuantityMetres()
                    .add(quantityMetres);

            if (product.getStockMetres()
                    .compareTo(newQuantity) < 0) {
                throw new IllegalArgumentException(
                        "Insufficient stock for requested quantity");
            }

            cartItem.setQuantityMetres(newQuantity);
        }

        return cartItemRepository.save(cartItem);
    }

    @Transactional(readOnly = true)
    public List<CartItem> getCart(Long userId) {
        getUser(userId);
        return cartItemRepository.findByUserId(userId);
    }

    public CartItem updateQuantity(Long userId, Long cartItemId,
                                   BigDecimal quantityMetres) {

        validateQuantity(quantityMetres);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Cart item not found"));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Cart item does not belong to this user");
        }

        Product product = cartItem.getProduct();

        if (product.getStockMetres().compareTo(quantityMetres) < 0) {
            throw new IllegalArgumentException(
                    "Insufficient stock available");
        }

        cartItem.setQuantityMetres(quantityMetres);
        return cartItemRepository.save(cartItem);
    }

    public void removeCartItem(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Cart item not found"));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Cart item does not belong to this user");
        }

        cartItemRepository.delete(cartItem);
    }

    public void clearCart(Long userId) {
        getUser(userId);
        cartItemRepository.deleteByUserId(userId);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found with ID: " + userId));
    }

    private Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Product not found with ID: " + productId));
    }

    private void validateQuantity(BigDecimal quantityMetres) {
        if (quantityMetres == null
                || quantityMetres.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero");
        }
    }
}
