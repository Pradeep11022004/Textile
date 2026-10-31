
package com.textilestore.textile_store.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.textilestore.textile_store.entity.OrderItem;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);
}

