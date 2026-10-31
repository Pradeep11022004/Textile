
package com.textilestore.textile_store.service;

import java.math.BigDecimal;


import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.textilestore.textile_store.entity.CartItem;
import com.textilestore.textile_store.entity.Order;
import com.textilestore.textile_store.entity.OrderItem;
import com.textilestore.textile_store.entity.OrderStatus;
import com.textilestore.textile_store.entity.Product;
import com.textilestore.textile_store.entity.User;
import com.textilestore.textile_store.repository.CartItemRepository;
import com.textilestore.textile_store.repository.OrderItemRepository;
import com.textilestore.textile_store.repository.OrderRepository;
import com.textilestore.textile_store.repository.ProductRepository;
import com.textilestore.textile_store.repository.UserRepository;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        CartItemRepository cartItemRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public Order placeOrder(Long userId, String shippingAddress,
                            String paymentMethod) {

        if (shippingAddress == null || shippingAddress.isBlank()) {
            throw new IllegalArgumentException(
                    "Shipping address is required");
        }

        if (paymentMethod == null || paymentMethod.isBlank()) {
            throw new IllegalArgumentException(
                    "Payment method is required");
        }

        String method = paymentMethod.trim().toUpperCase();

        if (!method.equals("COD") && !method.equals("ONLINE")) {
            throw new IllegalArgumentException(
                    "Payment method must be COD or ONLINE");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found"));

        List<CartItem> cartItems =
                cartItemRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException(
                    "Your cart is empty");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem item : cartItems) {
            Product product = productRepository.findById(
                    item.getProduct().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Product not found"));

            if (product.getStockMetres()
                    .compareTo(item.getQuantityMetres()) < 0) {
                throw new IllegalArgumentException(
                        "Insufficient stock for " + product.getName());
            }

            BigDecimal subtotal = product.getPricePerMetre()
                    .multiply(item.getQuantityMetres());

            totalAmount = totalAmount.add(subtotal);
        }

        Order order = new Order(
                user,
                totalAmount,
                shippingAddress.trim(),
                method
        );

        order.setStatus(OrderStatus.PENDING);
        order = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem item : cartItems) {
            Product product = productRepository.findById(
                    item.getProduct().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Product not found"));

            BigDecimal quantity = item.getQuantityMetres();
            BigDecimal price = product.getPricePerMetre();
            BigDecimal subtotal = price.multiply(quantity);

            product.setStockMetres(
                    product.getStockMetres().subtract(quantity));

            productRepository.save(product);

            OrderItem orderItem = new OrderItem(
                    order, product, quantity, price, subtotal);

            orderItems.add(orderItem);
        }

        orderItemRepository.saveAll(orderItems);
        cartItemRepository.deleteByUserId(userId);

        return order;
    }

    @Transactional(readOnly = true)
    public List<Order> getCustomerOrders(Long userId) {
        return orderRepository
                .findByUserIdOrderByOrderDateDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<OrderItem> getOrderItems(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new IllegalArgumentException(
                    "Order not found");
        }

        return orderItemRepository.findByOrderId(orderId);
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Order not found with ID: " + orderId));
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        if (status == null) {
            throw new IllegalArgumentException(
                    "Order status is required");
        }

        Order order = getOrderById(orderId);
        order.setStatus(status);

        return orderRepository.save(order);
    }
    
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }
    
}
