package com.textilestore.textile_store.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.textilestore.textile_store.entity.Order;
import com.textilestore.textile_store.entity.OrderStatus;
import com.textilestore.textile_store.entity.User;
import com.textilestore.textile_store.repository.OrderRepository;
import com.textilestore.textile_store.repository.UserRepository;

@Service
@Transactional
public class AdminService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public AdminService(OrderRepository orderRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    @Transactional(readOnly = true)
    public List<User> getAllCustomers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole().name()
                        .equals("CUSTOMER"))
                .toList();
    }

    // Dashboard statistics
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {

        long totalOrders = orderRepository.count();

        long pendingOrders =
                orderRepository.countByStatus(OrderStatus.PENDING);

        long deliveredOrders =
                orderRepository.countByStatus(OrderStatus.DELIVERED);

        BigDecimal totalRevenue =
                orderRepository.calculateTotalRevenue(
                        OrderStatus.CANCELLED);

        long totalCustomers = getAllCustomers().size();

        return Map.of(
                "totalOrders", totalOrders,
                "pendingOrders", pendingOrders,
                "deliveredOrders", deliveredOrders,
                "totalRevenue", totalRevenue,
                "totalCustomers", totalCustomers
        );
    }

    public Order updateOrderStatus(Long orderId,
                                   OrderStatus status) {
        if (status == null) {
            throw new IllegalArgumentException(
                    "Order status is required");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Order not found with ID: " + orderId));

        order.setStatus(status);

        return orderRepository.save(order);
    }
}