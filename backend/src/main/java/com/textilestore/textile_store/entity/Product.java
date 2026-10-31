
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
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String material;

    @Column(length = 100)
    private String color;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerMetre;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal stockMetres;

    @Column(length = 1000)
    private String imageUrl;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public Product() {
    }

    public Product(String name, String material, String color,
                   BigDecimal pricePerMetre, BigDecimal stockMetres,
                   String imageUrl, String description, Category category) {
        this.name = name;
        this.material = material;
        this.color = color;
        this.pricePerMetre = pricePerMetre;
        this.stockMetres = stockMetres;
        this.imageUrl = imageUrl;
        this.description = description;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public BigDecimal getPricePerMetre() {
        return pricePerMetre;
    }

    public void setPricePerMetre(BigDecimal pricePerMetre) {
        this.pricePerMetre = pricePerMetre;
    }

    public BigDecimal getStockMetres() {
        return stockMetres;
    }

    public void setStockMetres(BigDecimal stockMetres) {
        this.stockMetres = stockMetres;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
