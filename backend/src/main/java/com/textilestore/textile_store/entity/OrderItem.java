
package com.textilestore.textile_store.entity;

import java.math.BigDecimal;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantityMetres;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerMetre;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    public OrderItem() {
    }

    public OrderItem(Order order, Product product,
                     BigDecimal quantityMetres,
                     BigDecimal pricePerMetre,
                     BigDecimal subtotal) {
        this.order = order;
        this.product = product;
        this.quantityMetres = quantityMetres;
        this.pricePerMetre = pricePerMetre;
        this.subtotal = subtotal;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public BigDecimal getQuantityMetres() {
        return quantityMetres;
    }

    public void setQuantityMetres(BigDecimal quantityMetres) {
        this.quantityMetres = quantityMetres;
    }

    public BigDecimal getPricePerMetre() {
        return pricePerMetre;
    }

    public void setPricePerMetre(BigDecimal pricePerMetre) {
        this.pricePerMetre = pricePerMetre;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
