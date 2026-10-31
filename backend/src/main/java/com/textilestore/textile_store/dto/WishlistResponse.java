
package com.textilestore.textile_store.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.textilestore.textile_store.entity.Wishlist;

public class WishlistResponse {

    private Long wishlistId;
    private Long productId;
    private String productName;
    private String material;
    private String color;
    private BigDecimal pricePerMetre;
    private String imageUrl;
    private BigDecimal stockMetres;
    private String categoryName;
    private LocalDateTime createdAt;

    public WishlistResponse() {
    }

    public WishlistResponse(Wishlist wishlist) {

        this.wishlistId = wishlist.getId();

        this.productId = wishlist.getProduct().getId();

        this.productName = wishlist.getProduct().getName();

        this.material = wishlist.getProduct().getMaterial();

        this.color = wishlist.getProduct().getColor();

        this.pricePerMetre =
                wishlist.getProduct().getPricePerMetre();

        this.imageUrl = wishlist.getProduct().getImageUrl();

        this.stockMetres =
                wishlist.getProduct().getStockMetres();

        this.categoryName =
                wishlist.getProduct().getCategory().getName();

        this.createdAt = wishlist.getCreatedAt();
    }

    public Long getWishlistId() {
        return wishlistId;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getMaterial() {
        return material;
    }

    public String getColor() {
        return color;
    }

    public BigDecimal getPricePerMetre() {
        return pricePerMetre;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public BigDecimal getStockMetres() {
        return stockMetres;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
