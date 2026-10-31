package com.textilestore.textile_store.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.textilestore.textile_store.entity.Order;
import com.textilestore.textile_store.entity.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    List<Order> findByStatus(OrderStatus status);

    List<Order> findAllByOrderByOrderDateDesc();

    // Count all orders
    long count();

    // Count orders by status
    long countByStatus(OrderStatus status);

    // Calculate revenue excluding cancelled orders
    @org.springframework.data.jpa.repository.Query(
        "SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status <> :status"
    )
    BigDecimal calculateTotalRevenue(
        @org.springframework.data.repository.query.Param("status") OrderStatus status
    );
}