
package com.textilestore.textile_store.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class OrderRequest {

    @NotBlank(message = "Shipping address is required")
    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String shippingAddress;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    public OrderRequest() {
    }

    public OrderRequest(String shippingAddress, String paymentMethod) {
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
