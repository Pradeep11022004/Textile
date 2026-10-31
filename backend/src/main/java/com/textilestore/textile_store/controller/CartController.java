
package com.textilestore.textile_store.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.textilestore.textile_store.entity.CartItem;
import com.textilestore.textile_store.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public CartItem addToCart(
            @RequestParam Long userId,
            @RequestBody Map<String, Object> request) {

        Long productId = Long.valueOf(
                request.get("productId").toString());

        BigDecimal quantityMetres = new BigDecimal(
                request.get("quantityMetres").toString());

        return cartService.addToCart(
                userId, productId, quantityMetres);
    }

    @GetMapping
    public List<CartItem> getCart(@RequestParam Long userId) {
        return cartService.getCart(userId);
    }

    @PutMapping("/items/{cartItemId}")
    public CartItem updateQuantity(
            @PathVariable Long cartItemId,
            @RequestParam Long userId,
            @RequestBody Map<String, Object> request) {

        BigDecimal quantityMetres = new BigDecimal(
                request.get("quantityMetres").toString());

        return cartService.updateQuantity(
                userId, cartItemId, quantityMetres);
    }

    @DeleteMapping("/items/{cartItemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeCartItem(
            @PathVariable Long cartItemId,
            @RequestParam Long userId) {

        cartService.removeCartItem(userId, cartItemId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(@RequestParam Long userId) {
        cartService.clearCart(userId);
    }
}
