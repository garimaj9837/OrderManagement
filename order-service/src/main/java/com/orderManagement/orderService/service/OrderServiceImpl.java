package com.orderManagement.orderService.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.orderManagement.orderService.dto.OrderItemResponseDto;
import com.orderManagement.orderService.dto.OrderRequestDto;
import com.orderManagement.orderService.dto.ProductDto;
import com.orderManagement.orderService.entity.Order;
import com.orderManagement.orderService.entity.OrderItem;
import com.orderManagement.orderService.exceptionHandler.OrderNotFoundException;
import com.orderManagement.orderService.repository.OrderItemRepository;
import com.orderManagement.orderService.repository.OrderRepository;

@Service
public class OrderServiceImpl implements OrderService {

    @Value("${customerServiceUrl}")
    private String customerServiceUrl;

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final OrderItemRepository orderItemRepository;
    private final RestTemplate restTemplate;

    public OrderServiceImpl(OrderRepository orderRepository, ProductService productService,
                            OrderItemRepository orderItemRepository, RestTemplate restTemplate) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.orderItemRepository = orderItemRepository;
        this.restTemplate = restTemplate;
    }

    // --------------------------
    // 🧩 Common Helper Methods
    // --------------------------

    private ProductDto validateAndFetchProduct(int productId, int quantity) {
        if (!productService.checkStockAvailability(productId, quantity)) {
            throw new RuntimeException("Product " + productId + " is out of stock!");
        }
        return productService.getProductById(productId);
    }

    private BigDecimal calculateSubtotal(int quantity, BigDecimal price, BigDecimal discount) {
        BigDecimal total = price.multiply(BigDecimal.valueOf(quantity));
        return total.subtract(discount != null ? discount : BigDecimal.ZERO);
    }

    private BigDecimal updateOrderTotal(Order order) {
        BigDecimal total = order.getOrderitems().stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);
        return total;
    }

    private void enrichOrderItem(Order order, OrderItem item) {
        ProductDto product = validateAndFetchProduct(item.getProductId(), item.getQuantity());
        item.setOrder(order);
        item.setPrice(product.getProductPrice());
        item.setDiscount(product.getProductDiscount());
        item.setSubtotal(calculateSubtotal(item.getQuantity(), item.getPrice(), item.getDiscount()));
    }

    private void validateCustomer(int customerId) {
        boolean valid = restTemplate.getForObject(customerServiceUrl + "/isValid/" + customerId, boolean.class);
        if (!valid) throw new RuntimeException("Invalid customer ID: " + customerId);
    }

    // --------------------------
    // 🧾 Core Order Operations
    // --------------------------

    @Transactional
    public Order createOrder(Order order) {
        validateCustomer(order.getCustomerId());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");

        for (OrderItem item : order.getOrderitems()) {
            enrichOrderItem(order, item);
        }

        updateOrderTotal(order);
        Order savedOrder = orderRepository.save(order);

        // ✅ After saving order, reduce product stock for each item
        for (OrderItem item : savedOrder.getOrderitems()) {
            productService.reduceStock(item.getProductId(), item.getQuantity());
        }

        return savedOrder;
    }

    public Order getOrderById(int orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not Found!"));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrders(Order updateOrder, int id) {
        Order order = getOrderById(id);
        order.setCustomerId(updateOrder.getCustomerId());
        order.setStatus(updateOrder.getStatus());
        order.setTotalAmount(updateOrder.getTotalAmount());
        order.setOrderDate(updateOrder.getOrderDate());
        return orderRepository.save(order);
    }

    public Order updateStatus(int id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void deleteOrder(int id) {
        orderRepository.deleteById(id);
    }

    public boolean existByOrderId(int id) {
        return orderRepository.existsById(id);
    }

    // --------------------------
    // 🧱 Item-Level Operations
    // --------------------------

    @Transactional
    public Order addItemToOrder(int orderId, OrderItem newItem) {
        Order order = getOrderById(orderId);
        enrichOrderItem(order, newItem);
        order.getOrderitems().add(newItem);
        updateOrderTotal(order);
        Order updatedOrder = orderRepository.save(order);

        // ✅ Reduce stock when new item is added
        productService.reduceStock(newItem.getProductId(), newItem.getQuantity());

        return updatedOrder;
    }

    @Transactional
    public Order updateItem(int orderId, int itemId, OrderItem updatedItem) {
        Order order = getOrderById(orderId);
        OrderItem existingItem = order.getOrderitems().stream()
                .filter(item -> item.getId() == itemId)
                .findFirst()
                .orElseThrow(() -> new OrderNotFoundException("Order item not found"));

        ProductDto product = validateAndFetchProduct(existingItem.getProductId(), updatedItem.getQuantity());
        existingItem.setQuantity(updatedItem.getQuantity());
        existingItem.setPrice(product.getProductPrice());
        existingItem.setDiscount(product.getProductDiscount());
        existingItem.setSubtotal(calculateSubtotal(existingItem.getQuantity(), existingItem.getPrice(), existingItem.getDiscount()));

        updateOrderTotal(order);
        Order updatedOrder = orderRepository.save(order);

        // ✅ Adjust stock as per new quantity (optional logic based on difference)
        productService.reduceStock(existingItem.getProductId(), updatedItem.getQuantity());

        return updatedOrder;
    }

    @Transactional
    public Order deleteItem(int orderId, int itemId) {
        Order order = getOrderById(orderId);
        order.getOrderitems().removeIf(item -> item.getId() == itemId);
        updateOrderTotal(order);
        return orderRepository.save(order);
    }

    @Override
    public List<OrderItemResponseDto> addToCart(OrderRequestDto orderRequestDto) {
        return null; // Optional, not implemented yet
    }
}
