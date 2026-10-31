
package com.textilestore.textile_store.controller;

import java.util.List;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.textilestore.textile_store.entity.Order;
import com.textilestore.textile_store.entity.OrderItem;
import com.textilestore.textile_store.entity.OrderStatus;
import com.textilestore.textile_store.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order placeOrder(
            @RequestParam Long userId,
            @RequestBody Map<String, String> request) {

        String shippingAddress = request.get("shippingAddress");
        String paymentMethod = request.get("paymentMethod");

        return orderService.placeOrder(
                userId, shippingAddress, paymentMethod);
    }

    @GetMapping
    public List<Order> getCustomerOrders(
            @RequestParam Long userId) {

        return orderService.getCustomerOrders(userId);
    }

    @GetMapping("/{orderId}")
    public Order getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    @GetMapping("/{orderId}/items")
    public List<OrderItem> getOrderItems(
            @PathVariable Long orderId) {

        return orderService.getOrderItems(orderId);
    }

    @PutMapping("/{orderId}/status")
    public Order updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request) {

        String statusValue = request.get("status");

        if (statusValue == null || statusValue.isBlank()) {
            throw new IllegalArgumentException(
                    "Order status is required");
        }

        OrderStatus status = OrderStatus.valueOf(
                statusValue.trim().toUpperCase());

        return orderService.updateOrderStatus(orderId, status);
    }
    @GetMapping("/admin")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
    
   
}
