
package com.textilestore.textile_store.controller;

import java.util.List;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.textilestore.textile_store.entity.Order;
import com.textilestore.textile_store.entity.OrderStatus;
import com.textilestore.textile_store.entity.User;
import com.textilestore.textile_store.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return adminService.getAllOrders();
    }

    @GetMapping("/customers")
    public List<Map<String, Object>> getAllCustomers() {
        return adminService.getAllCustomers()
                .stream()
                .map(this::toCustomerResponse)
                .toList();
    }

    @PutMapping("/orders/{orderId}/status")
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

        return adminService.updateOrderStatus(orderId, status);
    }

    private Map<String, Object> toCustomerResponse(User user) {
        return Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "enabled", user.isEnabled()
        );
    }
    @GetMapping("/dashboard/stats")
    public Map<String, Object> getDashboardStats() {
        return adminService.getDashboardStats();
    }
}
