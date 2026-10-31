
package com.textilestore.textile_store.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CartItemRequest {

    @NotNull(message = "Product ID is required")
    @Positive(message = "Product ID must be greater than zero")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than zero")
    private BigDecimal quantityMetres;

    public CartItemRequest() {
    }

    public CartItemRequest(Long productId, BigDecimal quantityMetres) {
        this.productId = productId;
        this.quantityMetres = quantityMetres;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public BigDecimal getQuantityMetres() {
        return quantityMetres;
    }

    public void setQuantityMetres(BigDecimal quantityMetres) {
        this.quantityMetres = quantityMetres;
    }
}
